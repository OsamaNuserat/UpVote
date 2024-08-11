import userModel from "../../DB/Model/user.model.js";
import { verifyToken } from "../Services/GenerateAndVerifyToken.js";

const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith(process.env.BEARER_KEY)) {
    return res.json({
      message: "authorization required",
    });
  }
  const token = authorization.split(process.env.BEARER_KEY)[1];
  if (!token) {
    return res.json({ message: "token is required" });
  }
  const decoded = verifyToken(token);
  const authUser = await userModel.findById(decoded.id).select("name email");
  if (!authUser) {
    return res.json({ message: "user not found" });
  }
  req.id = decoded.id;
  next();
};

export default auth;
