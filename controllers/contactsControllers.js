import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contacts.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const allContacts = await Contact.find({ owner });
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const oneContact = await Contact.findOne({ _id: id, owner: req.user.id });
    if (!oneContact) {
      throw new HttpError(404);
    }
    res.status(200).json(oneContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
    if (!contact) {
      throw new HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const { name, email, phone } = req.body;
  const owner = req.user.id;
  try {
    const newContact = await Contact.create({ name, email, phone, owner });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      body,
      {
        new: true,
      }
    );
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

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: req.user.id },
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
