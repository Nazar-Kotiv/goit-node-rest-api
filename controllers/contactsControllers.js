// import {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateOneContact,
// } from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const allContacts = await Contact.find();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

// export const getAllContacts = async (req, res, next) => {
//   try {
//     const contacts = await listContacts();
//     res.status(200).json(contacts);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getOneContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const contact = await getContactById(id);
//     if (contact) {
//       res.status(200).json(contact);
//     } else {
//       throw new HttpError(404);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oneContact = await Contact.findById(id);
    if (oneContact) {
      res.status(200).json(oneContact);
    } else {
      throw new HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

// export const deleteContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const contact = await removeContact(id);
//     if (contact) {
//       res.status(200).json(contact);
//     } else {
//       throw new HttpError(404);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (contact) {
      res.status(200).json(contact);
    } else {
      throw new HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

// export const createContact = async (req, res, next) => {
//   const { name, email, phone } = req.body;
//   try {
//     const newContact = await addContact(name, email, phone);
//     res.status(201).json(newContact);
//   } catch (error) {
//     next(error);
//   }
// };

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const newContact = await Contact.create(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

// export const updateContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { body } = req;
//     const updatedContact = await updateOneContact(id, body);
//     if (!updatedContact) {
//       throw new HttpError(404);
//     }
//     res.status(200).json(updatedContact);
//   } catch (error) {
//     next(error);
//   }
// };

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedContact = await Contact.findByIdAndUpdate(id, body);
    if (!updatedContact) {
      throw new HttpError(404);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
