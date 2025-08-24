import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String
    },
    password:{
        type:String,
        required:[true, "Password is required"],
    },
    refreshToken:{
        type:String,
    },
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordMatch = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    console.log("for id",this._id);
    try{
        const token = jwt.sign({
            _id:this._id,
            username:this.username,
            email:this.email,
            fullname:this.fullname
        }
        ,process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
    return token
    }catch(err){
        console.error("Error generating access token",err);
        throw new Error("Error generating access token")
}}

userSchema.methods.generateRefreshToken=function(){
    console.log("Refreshtoken for id",this._id);
    try{
        const token = jwt.sign({
            _id:this._id,
            username:this.username,
            email:this.email,
            fullname:this.fullname
        }
        ,process.env.RRFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
    return token
    }catch(err){
        console.error("Error generating refresh token",err);
        throw new Error("Error generating refresh token")
    }
}
export const User = mongoose.model("User",userSchema)