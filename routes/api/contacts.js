const express = require("express");
const router = express.Router();
const contactsHandler = require("./contactsHandler");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await contactsHandler.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
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

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    res.status(400).json({ message: "Missing required fields" });
  } else {
    try {
      const newContact = await addContact({ name, email, phone });
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const result = await removeContact(contactId);
    if (result) {
      res.status(200).json({ message: "Contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const contactId = req.params.contactId;
  const updatedFields = req.body;

  if (!updatedFields || Object.keys(updatedFields).length === 0) {
    res.status(400).json({ message: "Missing fields" });
  } else {
    try {
      const updatedContact = await updateContact(contactId, updatedFields);
      if (updatedContact) {
        res.status(200).json(updatedContact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
