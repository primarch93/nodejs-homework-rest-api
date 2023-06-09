const express = require('express');
const { registerSchema } = require("../../schemas/usersSchemas");
const { validateBody } = require('../../middlewares/validateBody');
const User = require('../models/user');
const HttpError = require("../helpers/HttpError");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const register = async (req, res) => {
   const newUser = await User.create(req.body);

   res.status(201).json({
    email: newUser.email,
    name: newUser.name,
   });
};

const router = express.Router();

router.post("/register", validateBody(registerSchema), ctrlWrapper(register));

module.exports = router;