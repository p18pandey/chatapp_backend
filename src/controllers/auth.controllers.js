import { generateToken } from '../lib/utils.js';
import User from '../models/user.models.js';
import bcrypt from "bcryptjs";


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
            _id : newUser._id ,
            fullName : newUser.fullName ,
            email : newUser.email,
            profilePic : newUser.profilePic,
            // hashedPassword : newUser.password

         })

      }
      else {
         res.status(400).json({message : "Invalid user data."});
      }

   } catch (error) {

      console.log("Error in signup controller.");
      res.status(500).json({message :"Internal Server Error."});
   }

   
}

export const login = (req, res) => {
   res.send("login route");

}

export const logout = (req, res) => {
   res.send("logout route");

}


