import jwt from "jsonwebtoken";

export const generateToken = (res, user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,   // set true in production (HTTPS)
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};
