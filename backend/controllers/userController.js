import User from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import bcrypt from 'bcryptjs';
import createToken from '../utils/createToken.js';

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !password || !email) {
    res.status(400);
    throw new Error('Please fill out all the inputs.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User Already Exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    console.error('Error saving the user:', error);
    res.status(400);
    throw new Error('Invalid user Data');
  }
});



// authenticate user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      createToken(res, existingUser._id);
      return res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    }
  }

  res.status(401).json({ message: 'Invalid email or password' });
});



// logout user
const logoutCurrentUser = asyncHandler(async(req, res) => {
      res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      })
      res.status(200).json({message: "Logged out successfully!"});
});




const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user){
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});


const updateCurrentUserProfile = asyncHandler(async (req, res) =>{
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }
  
    const updatedUser = await user.save();
  
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });

  } else {
    res.status(404)
    throw new Error("User not found");
  }
});


const deleterUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user){
    if (user.isAdmin) {
      res.status(400)
      throw new Error('Cannot delete admin user');
    }

    await User.deleteOne({_id: user._id})
    res.json({message: "User successfully removed!"});
  } else {
      res.status(404)
      throw new Error("User not found.");
  }
});


const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user){
    res.json(user)
  } else {
    res.status(404)
    throw new Error("User Not Found");
  }
});


const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      res.status(400);
      throw new Error("Email already taken!");
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});




export { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, deleterUserById, getUserById, updateUserById};