import userModel from "../../../../DB/Model/user.model.js";
import { asyncHandler } from "../../../Services/ErrorHandling.js";
import {
  generateToken,
  verifyToken,
} from "../../../Services/GenerateAndVerifyToken.js";
import {
  comparePassword,
  hashPassword,
} from "../../../Services/HashAndCompare.js";
import { sendEmail } from "../../../Services/nodeMailer.js";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    return next(new Error("email exists"));
  }
  const hashedPassword = hashPassword(password);

  const token = generateToken({ email }, process.env.CONFIRM_SIGNATURE);
  const link = `http://localhost:3000/auth/confirm-email/${token}`;
  await sendEmail(email, `<a href="${link}"> Verify Your Email </a>`);

  const createUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });
  return res.json({ message: "success", createUser });
};

export const confirmEmail = async (req, res, next) => {
  const { token } = req.params;

  const decoded = verifyToken(token, process.env.CONFIRM_SIGNATURE);
  const user = await userModel.updateOne(
    { email: decoded.email },
    { confirmEmail: true }
  );

  if (!user) {
    return next(new Error("User not found"));
  }

  return res.json({ message: "success, you can login" });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("User not found"));
  }
  if (user.confirmEmail === false) {
    return next(new Error("please confirm your email"));
  }

  const match = comparePassword(password, user.password);
  if (!match) {
    return next(new Error("password doesnt match"));
  }
  const token = generateToken({ id: user._id, isLoggedIn: true });
  return res.json({ message: "success", token });
};
