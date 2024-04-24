import contactsService from "../services/contactsServices.js";
import { contactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = (req, res) => {
  const contacts = contactsService.listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = (req, res) => {
  const { id } = req.params;
  const contact = contactsService.getContactById(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = (req, res) => {
  const { id } = req.params;
  const contact = contactsService.removeContact(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.message });
  } else {
    try {
      const newContact = addContact(req.body);
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateContact = (req, res) => {};
