const express = require("express");
const router = express.Router();
const contactsHandler = require("./contactsHandler");
const authMiddleware = require("../../middleware/authMiddleware");
const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const contacts = await contactsHandler.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const contactId = req.params.id;
  try {
    const contact = await contactsHandler.getById(contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  const { name, email, phone } = req.body;

  try {
    const newContact = await contactsHandler.addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const contactId = req.params.id;

  try {
    const result = await contactsHandler.removeContact(contactId);
    if (result) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const contactId = req.params.id;
  const updatedFields = req.body;

  const { error } = contactSchema.validate(updatedFields);

  if (error) {
    return res.status(400).json({ message: error.message });
  }

  try {
    const updatedContact = await contactsHandler.updateContact(
      contactId,
      updatedFields
    );
    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:contactId/favorite", authMiddleware, async (req, res) => {
  const contactId = req.params.contactId;
  const { favorite } = req.body;

  if (typeof favorite === "undefined") {
    return res.status(400).json({ message: "missing field favorite" });
  }

  try {
    const updatedContact = await contactsHandler.updateStatusContact(
      contactId,
      { favorite }
    );

    if (updatedContact) {
      res.status(200).json(updatedContact);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/logout", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    user.token = null;
    await user.save();

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get("/current", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
