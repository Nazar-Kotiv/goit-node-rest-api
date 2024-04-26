import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateOneContact,
} from "../services/contactsServices.js";

import { createContactSchema } from "../schemas/contactsSchemas.js";
import { updateContactSchema } from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await removeContact(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "Not found" });
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const { error } = createContactSchema.validate({ name, email, phone });
  if (error) {
    res.status(400).json({ message: error.message });
  } else {
    try {
      const newContact = await addContact(name, email, phone);
      res.status(201).json(newContact);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  if (Object.keys(body).length === 0) {
    const error = new Error("Body must have at least one field");
    error.status = 400;
    return next(error);
  }
  const { error: validationError } = updateContactSchema.validate(body);
  if (validationError) {
    const error = new Error(validationError.message);
    error.status = 400;
    return next(error);
  }

  try {
    const updatedContact = await updateOneContact(id, body);
    if (!updatedContact) {
      const error = new Error("Not found");
      error.status = 404;
      return next(error);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
