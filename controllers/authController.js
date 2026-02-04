import User from "../models/User.js";
import generateToken from "../config/generateToken.js";


// @desc   Register admin (one time)
// @route  POST /api/auth/register
// @access Public (temporary)
export const registerAdmin = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { email, password } = req.body;

    // check if admin already exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // create admin
    const admin = await User.create({
      email,
      password,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
  res.status(500).json({ message: "Server error" });
  }
};
// @desc   Login admin
// @route  POST /api/auth/login
// @access Public
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

