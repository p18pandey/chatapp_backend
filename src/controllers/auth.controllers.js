import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from "bcryptjs";
import cloudinary from '../lib/cloudinary.js';


export const signup = async (req, res) => {
   const { fullName,email, password } = req.body;
   try {

      if(!fullName || !email || !password){
         return res.status(400).json({ message: "All fields are required." });

      }
      
      if (password.length < 6) {
         return res.status(400).json({ message: "Password must be atleast 6 character." });
      }

      const user = await User.findOne({ email });
      if (user) {
         return res.status(400).json({ message: "Email already exist , use another email." });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
         fullName:fullName,
         email:email,
         password:hashedPassword
      });
      // await newUser.save();

      if(newUser) {
         // generate jwt token
        
         await newUser.save();
         generateToken(newUser._id,res);

         res.status(201).json({
            message:"Signup Successful",
            _id : newUser._id ,
            fullName : newUser.fullName ,
            email : newUser.email,
            profilePic : newUser.profilePic,
            

         })

      }
      else {
         res.status(400).json({message : "Invalid user data."});
      }

   } catch (error) {

      console.log("Error in signup controller.",error.message);
     return res.status(500).json({message :"Internal Server Error."});
   }

   
}

export const login = async (req, res) => {
   const { email, password } = req.body;
   try {
     const user = await User.findOne({ email });
 
     if (!user) {
       return res.status(400).json({ message: "Invalid credentials" });
     }
 
     const isPasswordCorrect = await bcrypt.compare(password, user.password);
     if (!isPasswordCorrect) {
       return res.status(400).json({ message: "Invalid credentials" });
     }
 
     generateToken(user._id, res);
 
     res.status(200).json({
       _id: user._id,
       fullName: user.fullName,
       email: user.email,
       profilePic: user.profilePic,
     });
   } catch (error) {
     console.log("Error in login controller", error.message);
     res.status(500).json({ message: "Internal Server Error" });
   }
 };

export const logout = async (req, res) => {
   // const {email} = req.body;
   try {
      // const user = await User.findOne({email});
      res.cookie("jwt","",{
         maxAge : 0,
         httpOnly: true,
      });
      res.status(200).json({
         message : "Logged out successfully.",
          
      });

   } catch (error) {
      console.log("Error in logout controller.",error.message);
      return res.status(500).json({message :"Internal Server Error."});
   }
   // res.send("logout route");

}


export const updateProfile = async (req,res) => {
  try {
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(400).json({message :"Profile Pic is required."});
   }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId , {profilePic:uploadResponse.secure_url}, {new:true});

    res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error in update profile :",error.message);
    return res.status(500).json({message : "Internal Server Error."});
  }
};

export const checkAuth =  (req , res) => {
 try {
   res.status(200).json(req.user);
 } catch (error) {
   console.log("Error in checkAuth controller :",error.message);
    res.status(500).json({message : "Internal Server Error."});
 }
};

// export const checkAuth = async (req, res) => {
//    try {
//        if (!req.user) {
//            return res.status(401).json({ message: "Unauthorized access" });  // Early return prevents multiple responses
//        }
//        res.status(200).json(req.user);  
//    } catch (error) {
//        console.error("Error in checkAuth controller:", error.message);
//        if (!res.headersSent) {  // Prevent sending headers twice
//            res.status(500).json({ message: "Internal Server Error." });
//        }
//    }
// };
