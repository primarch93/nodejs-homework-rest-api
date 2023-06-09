const express = require('express');
const {registerSchema, loginSchema, updateUserSubscriptionSchema,} = require("../../schemas/usersSchemas");
const validateBody = require('../../middlewares/validateBody');
const {register} = require('../../controllers/auth')



const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

module.exports = router;