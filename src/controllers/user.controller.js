import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async(req,res,next)=>{
    const {email,fullname,username,password} = req.body;
    console.log("email is",email);
    if ([email,fullname,username,password].some(field => !field)) {
        throw new ApiError(400, "All fields are required in it")
    }
    const existedUser=await User.findOne({
        $or:[{email},{username}]
    })
    if (existedUser){
        console.log(existedUser);
        throw new ApiError(401, "User with this email or username already exists")
    }
    console.log(req.files);

    const avatarlocalpath=req.files?.avatar[0]?.path
    const coverImagelocalpath=req.files?.coverImage[0]?.path

    if (!avatarlocalpath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar=await uploadOnCloudinary(avatarlocalpath)
    const coverImage=await uploadOnCloudinary(coverImagelocalpath)

    console.log("Avatar:", avatar);
    if (!avatar){
        throw new ApiError(500, "Error uploading avatar")
    }
    const user = await User.create({
        email,
        fullname,
        username:username.toLowerCase(),
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    console.log("userCreated",userCreated);

    if (!userCreated){
        throw new ApiError(500, "Error creating user")
    }

    return res.status(201).json(
        new ApiResponse(201, userCreated, "User created successfully")
    )
});

const generateTokens=async(userid)=>{
    try{
        const user = await User.findById(userid)
        const AccessToken= user.generateAccessToken();
        const RefreshToken= user.generateRefreshToken();
        user.refreshToken=RefreshToken
        await user.save({validateBeforeSave: false})

        return {AccessToken, RefreshToken}
    }catch(err){
        
        throw new ApiError(500, "Error generating tokens")
    }
}
     
const loginUser = asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    if (!email){
        throw new ApiError(400, "Email are required")
    }
    const user=await User.findOne({
        $or:[{email}]
    })
    console.log(user);
    if (!user){
        throw new ApiError(404, "User not found")
    }
    const  ispassword = await user.isPasswordMatch(password)
    if (!ispassword){
        throw new ApiError(400, "Wrong Password")
    }
    const {accessToken,refreshToken} = await generateTokens(user._id)
    
    const loggedInUser= await User.findById(user._id).select(
        "-password -refreshToken -watchHistory"
    )
    
    const options = {
        httpOnly:true,
        secure:true,

    }
    return res.status
    (200).cookie("accesstoken",accessToken,options)
    .cookie("refreshtoken",refreshToken,options)
    .json(new ApiResponse(200,{
        user:loggedInUser,
        accessToken,
        refreshToken
    },"Login successful"))

})
 
const logoutUser=asyncHandler(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .clearCookie("accesstoken",options)
    .clearCookie("refreshtoken",options)

})
 
const refreshAccessToken = asyncHandler(async(req,res,next)=>{
    const refreshToken = req.cookie.refreshtoken
    if (!refreshToken){
        throw new ApiError(401,"Please login again")
    }
    decodedRefreshToken = jwt.verify(refreshToken,process.env.RRFRESH_TOKEN_SECRET)
    const user=await User.findById(decodedRefreshToken?._id)
    if (!user){
        throw new ApiError(401, "invalid refresh token")

    }
    if (refreshToken1!==user.refreshToken){
        throw new ApiError(401, "invalid refresh token, expired")
    }
    const options={
        httpOnly:true,
        secure:true
    }
    const {accessToken,refreshToken1}=await generateTokens(user._id)
    return res.status(200)
    .cookie("accesstoken"   , accessToken, options)
    .cookie("refreshtoken", refreshToken1, options)
    .json(new ApiResponse(200, {
        accessToken,
        refreshToken1}, "Access token refreshed successfully"))
    
});

const changeCurrentPassword = asyncHandler(async(req,res,next)=>{
    const {oldPassword,newPassword,confirmPassword} = req.body;
    if (!oldPassword || !newPassword || !confirmPassword){
        throw new ApiError(400, "All fields are required")
    }
    if (newPassword !== confirmPassword){
        throw new ApiError(400, "New password and confirm password do not match")
    }
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const isPasswordMatch = await user.isPasswordMatch(oldPassword)
    if (!isPasswordMatch){
        throw new ApiError(400, "Old password is incorrect")
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponse(200, null, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async(req,res,next)=>{
    const user= await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404,"User not found")

    }
    return res.status(200).
    json(new ApiResponse(200,{user},"Current user fetch successfull"))
})

const updateAccountDetails = asyncHandler(async(req,res,next)=>{
    const {fullname,email} = req.body
    if(!fullname || !email){
        throw new ApiError(400, "Fullname and email are required")
    }
    const user =await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                email
            }
        },
        {new:true}
    ).select("-password -refreshToken")

    res.status(200).
    json(new ApiResponse(200,{user},"Account details updated"))
})

const updateAvatar = asyncHandler(async(req,res,next)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")

    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    await User.findByIdAndUpdate(
        req.user?._id,
        {$set:{
            avatar:avatar.url
        }
    },
        {new:true}
    )
})

const deleteAvatar = asyncHandler(async(req,res,next)=>{
    const avatarLocalPath = req.file.path
    if (!avatarLocalPath){
        throw new ApiError(400,"Avatar not found")
    } 
    const user = await User.findById(req.user._id)
    if(!user){
        throw new ApiError(400,"User not found")
    }
    const userURL = user.avatar
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:null
            }
        },
        {new:true}
    )
    await cloudinary.uploader.destroy(filename)
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    deleteAvatar 
} 
