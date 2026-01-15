import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* ================= REGISTER ================= */
export const register = async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      userPassword,
      gender,
      address,
      role,
      isAssigned,
      applications
    } = req.body;

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashPassword = await bcrypt.hash(userPassword, 10);

    const newUser = new User({
      userName,
      userEmail,
      userPassword: hashPassword,
      gender,
      address,
      role,
      isAssigned,
      applications
    });

    await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true only in production (https)
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ success: true, message: 'Logged out' });
};
