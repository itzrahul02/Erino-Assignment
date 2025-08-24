import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.log("ERROR in connection",err);
    }
}

connectDB()
export default connectDB;