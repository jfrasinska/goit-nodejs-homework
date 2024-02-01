const fs = require("fs").promises;
const path = require("path");
const { nanoid } = "nanoid";

const contactsPath = path.join(__dirname, "../../contacts.json");

const readContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeContacts = async (contacts) => {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf-8");
};

const listContacts = async () => {
  return await readContacts();
};

const getById = async (id) => {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === id);
};

const addContact = async (contact) => {
  const contacts = await readContacts();
  contact.id = nanoid();
  contacts.push(contact);
  await writeContacts(contacts);
  return contact;
};

const removeContact = async (id) => {
  let contacts = await readContacts();
  contacts = contacts.filter((contact) => contact.id !== id);
  await writeContacts(contacts);
  return contacts.length !== contacts.length;
};

const updateContact = async (id, updatedFields) => {
  let contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...updatedFields };
    await writeContacts(contacts);
    return contacts[index];
  }
  return null;
};

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
