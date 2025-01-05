import mongoose from 'mongoose';

export const connectDB = async () =>{
  try{
  const conn = await mongoose.connect(process.env.MONGODB_URI);
  console.log("Database connected successfully.");
  }
  catch{  
    console.log("Database connection error : " , error);
  }
};


