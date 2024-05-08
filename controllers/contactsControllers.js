import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const allContacts = await Contact.find({ owner: owner.toString() });
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oneContact = await Contact.findById(id);
    if (oneContact.owner.toString() !== req.user.id) {
      const error = new HttpError(404);
      return next(error);
    }
    if (oneContact) {
      res.status(200).json(oneContact);
    } else {
      throw new HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

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

export const createContact = async (req, res, next) => {
  // const { name, email, phone, owner } = req.body;
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    owner: req.user.id,
  };
  try {
    const newContact = await Contact.create(contact);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedContact) {
      throw new HttpError(404);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
export const updateFavoriteStatus = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (typeof favorite !== "boolean") {
      throw new HttpError(400, "Favorite field must be a boolean value");
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );

    if (!updatedContact) {
      throw new HttpError(404, "Contact not found");
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
