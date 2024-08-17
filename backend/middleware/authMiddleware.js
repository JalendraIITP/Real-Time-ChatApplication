import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
      throw new Error("Unautorised Request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?.id).select("-password -refreshToken")
    if (!user) {
      throw new Error("Invalid Access Token");
    }
    req.user = user;
    next();
} catch (error) {
    throw new Error("Invalid Access Token")
}
});

export default  { protect };
