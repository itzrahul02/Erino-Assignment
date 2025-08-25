import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const assertEnv = (key) => {
  if (!process.env[key]) {
    throw new ApiError(500, `Server misconfigured: missing ${key}`);
  }
};

const buildCookieOptions = () => {

  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };
};


const generateTokens = async (userId) => {
  assertEnv('JWT_SECRET');
  assertEnv('REFRESH_TOKEN_SECRET');

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const accessToken = jwt.sign(
    { _id: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { _id: user._id.toString(), email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};


const registerUser = asyncHandler(async (req, res) => {
  let { email, fullname, username, password } = req.body;

  if ([email, fullname, username, password].some((f) => !f || String(f).trim() === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  email = String(email).toLowerCase().trim();
  username = String(username).toLowerCase().trim();

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, 'User with this email or username already exists');
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, 'Avatar is required');

  const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUpload?.url) throw new ApiError(502, 'Failed to upload avatar');

  let coverImageUrl = '';
  if (coverImageLocalPath) {
    const coverUpload = await uploadOnCloudinary(coverImageLocalPath);
    if (coverUpload?.url) coverImageUrl = coverUpload.url;
  }

  const user = await User.create({
    email,
    fullname,
    username,
    password,
    avatar: avatarUpload.url,
    coverImage: coverImageUrl,
  });

  const userCreated = await User.findById(user._id).select('-password -refreshToken');
  return res.status(201).json(new ApiResponse(201, userCreated, 'User created successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) throw new ApiError(404, 'User not found');

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) throw new ApiError(400, 'Wrong password');

  const { accessToken, refreshToken } = await generateTokens(user._id);
  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const cookieOptions = buildCookieOptions();

  return res
    .status(200)
    .cookie('accesstoken', accessToken, cookieOptions)
    .cookie('refreshtoken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, 'Login successful'));
});


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },{ new: true }
  );

  const cookieOptions = buildCookieOptions();

  return res
    .status(200)
    .clearCookie('accesstoken', cookieOptions)
    .clearCookie('refreshtoken', cookieOptions)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  assertEnv('REFRESH_TOKEN_SECRET');

  const incoming = req.cookies?.refreshtoken || req.headers['x-refresh-token'];
  if (!incoming) throw new ApiError(401, 'Please login again');

  let decoded;
  try {
    decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(decoded?._id);
  if (!user || user.refreshToken !== incoming) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

  const cookieOptions = buildCookieOptions();

  return res
    .status(200)
    .cookie('accesstoken', accessToken, cookieOptions)
    .cookie('refreshtoken', newRefreshToken, cookieOptions)
    .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, 'Access token refreshed successfully'));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError(400, 'All fields are required');
  }
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, 'New password and confirm password do not match');
  }

  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, 'User not found');

  const ok = await user.isPasswordMatch(oldPassword);
  if (!ok) throw new ApiError(400, 'Old password is incorrect');

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');

  return res.status(200).json(new ApiResponse(200, { user }, 'Current user fetched successfully'));
});


const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) throw new ApiError(400, 'Fullname and email are required');

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { fullname, email: String(email).toLowerCase().trim() },
    { new: true }
  ).select('-password -refreshToken');

  return res.status(200).json(new ApiResponse(200, { user }, 'Account details updated'));
});


const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, 'Avatar is required');

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) throw new ApiError(502, 'Failed to upload avatar');

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { avatar: avatar.url },
    { new: true }
  ).select('-password -refreshToken');

  return res.status(200).json(new ApiResponse(200, { user }, 'Avatar updated successfully'));
});

const deleteAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, 'User not found');

  await User.findByIdAndUpdate(req.user._id, { avatar: null }, { new: true });

  return res.status(200).json(new ApiResponse(200, null, 'Avatar deleted successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  deleteAvatar,
};
