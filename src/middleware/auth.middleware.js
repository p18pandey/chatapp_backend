import jwt from "jsonwebtoken";
import User from '../models/user.models.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
           return res.status(401).json({ message: "Not authorized, token not provided." });

        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   if(!decoded){
      //      return  res.status(401).json({message :"Not authorized, token invalid."});
      //   }

        const user = await User.findById(decoded.id).select("-password");
        if(!user){
           return  res.status(401).json({message :"User not found."});

        }
        req.user = user ;
      //   console.log(user);

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware :" ,error.message);
         res.status(500).json({message :"Internal Server Error."});

    }
};