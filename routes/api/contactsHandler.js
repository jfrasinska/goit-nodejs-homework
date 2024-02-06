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
});

const Contact = mongoose.model("Contact", contactSchema);

const connectionString =
  "mongodb+srv://jfrasinska:WlazlKotekNaPlotek@cluster0.zoh3uaf.mongodb.net/contacts";

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

// const fs = require("fs").promises;
// const path = require("path");
// const { createHash } = require("crypto");

// const contactsPath = path.join(__dirname, "../../contacts.json");

// const readContacts = async () => {
//   try {
//     const data = await fs.readFile(contactsPath, "utf-8");
//     return JSON.parse(data);
//   } catch (error) {
//     return [];
//   }
// };

// const writeContacts = async (contacts) => {
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
// };

// const generateUniqueId = () => {
//   const hash = createHash("sha256");
//   hash.update(Math.random().toString());
//   return hash.digest("hex");
// };

// const listContacts = async () => {
//   return await readContacts();
// };

// const getById = async (id) => {
//   const contacts = await readContacts();
//   return contacts.find((contact) => contact.id === id);
// };

// const addContact = async (contact) => {
//   const contacts = await readContacts();
//   contact.id = generateUniqueId();
//   contacts.push(contact);
//   await writeContacts(contacts);
//   return contact;
// };

// const removeContact = async (id) => {
//   let contacts = await readContacts();
//   contacts = contacts.filter((contact) => contact.id !== id);
//   await writeContacts(contacts);
//   return contacts.length !== contacts.length;
// };

// const updateContact = async (id, updatedFields) => {
//   let contacts = await readContacts();
//   const index = contacts.findIndex((contact) => contact.id === id);
//   if (index !== -1) {
//     contacts[index] = { ...contacts[index], ...updatedFields };
//     await writeContacts(contacts);
//     return contacts[index];
//   }
//   return null;
// };

// module.exports = {
//   listContacts,
//   getById,
//   addContact,
//   removeContact,
//   updateContact,
// };
