const express = require('express')
const Contact = require('../../models/contact')
const router = express.Router()
const HttpError= require('../../helpers/HttpError')
const {contactAddSchema, updateSchemas} = require('../../schemas/contactsSchemas')
const authenticate = require('../../middlewares/authenticate');

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const result = await Contact.find({})
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw new HttpError(400, "missing required name field");
    }
    const {_contactIdid: owner} = req.owner;
    const result = await Contact.create(...req.body, owner);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = updateSchemas.validate(req.body);
    if (error) {
      throw new HttpError(400, "missing fields");
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body,{new: true});
    if (!result) {
      throw new HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
try {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
res.json(result);
}
catch (error) {
  next(error);
}
})

module.exports = router;