import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"
const connectDB = async()=>{
    try{
        await mongoose.connect(`mongodb+srv://rahulbikker:V6Cm9DMkNeUD81AX@backend.bwbiiit.mongodb.net/`)
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.log("ERROR in connection",err);
    }
}

connectDB()
export default connectDB;