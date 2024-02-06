const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

const connectionString = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

db.once("open", () => {
  console.log("Database connection successful");
});

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    throw error;
  }
};

const getById = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    throw error;
  }
};

const addContact = async (contact) => {
  try {
    return await Contact.create(contact);
  } catch (error) {
    throw error;
  }
};

const removeContact = async (id) => {
  try {
    return await Contact.findByIdAndRemove(id);
  } catch (error) {
    throw error;
  }
};

const updateContact = async (id, updatedFields) => {
  try {
    return await Contact.findByIdAndUpdate(id, updatedFields, { new: true });
  } catch (error) {
    throw error;
  }
};

const updateStatusContact = async (id, { favorite }) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { favorite },
      { new: true }
    );

    if (contact) {
      return contact;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};