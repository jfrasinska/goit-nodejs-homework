const mongoose = require("mongoose");
const { Schema } = mongoose;

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
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Contact = mongoose.model("Contact", contactSchema);

const listContacts = async (ownerId) => {
  try {
    return await Contact.find({ owner: ownerId });
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
