const express = require("express");
const router = express.Router();
const contactsHandler = require("./contactsHandler");

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const newContact = await contactsHandler.addContact({ name, email, phone });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
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

router.put("/:id", async (req, res) => {
  const contactId = req.params.id;
  const updatedFields = req.body;

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
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
