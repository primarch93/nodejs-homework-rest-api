const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;
const HttpError = require("../helpers/HttpError");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const gravatar = require("gravatar");
const fs = require("fs/promises");
const Jimp = require("jimp");
const path = require("path");

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new HttpError(409, "Email already in use");
    }
  
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: 250, d: "mp", r: "pg" });
    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      avatarURL,
    });
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      avatarURL: newUser.avatarURL,
    });
  };
  

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError(401, "Email or password is incorrect");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new HttpError(401, "Email or password is incorrect");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
    });
};

const getCurrent = async (req, res) => {
    const { email, name } = req.user;
    res.json({
      email,
      name,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
      message: "Logout success",
    });
};

const updateUserSubscription = async (req, res) => {
    const { subscription } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return new HttpError(401, "Unauthorized");
    }
    await User.findByIdAndUpdate(req.user._id, { subscription });
    res.json({ message: "Subscription updated successfully" });
};

const updateUserAvatar = async (req, res) => {
  const { _id: id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    return new HttpError(401, "Unauthorized");
  }

  const { path: oldPath, originalname } = req.file;
  const filename = `${id}_${originalname}`;
  const avatarsPath = path.resolve("public", "avatars");
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  const image = await Jimp.read(newPath);
  image.resize(250, 250);

  await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
  res.json({ message: "Avatar updated successfully" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  updateUserAvatar: ctrlWrapper(updateUserAvatar),
};