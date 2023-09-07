const Contact = require("../models/contacts.js");

const { error } = require("node:console");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const schemas = require("../models/contacts.js");

async function get(req, res, next) {
  try {
    const data = await Contact.find({ owner: req.user.id }).exec();
    res.status(200).send(data);
  } catch (err) {
    console.log(err);
    next(error);
  }
}

async function getById(req, res, next) {
  const id = req.params["contactId"];
  const data = await Contact.findById(id).exec();
  if (data !== null && data.owner.toString() === req.user.id) {
    res.status(200).send(data);
  } else {
    res.status(404).json({ message: "Not found" });
  }
}

async function add(req, res, next) {
  const { error, value } = schemas.contactSchema.validate(req.body);
  const newContact = await Contact.create({
    ...value,
    id: uuidv4(),
    owner: req.user.id,
  });
  if (typeof error !== "undefined") {
    res.status(400).json(error.details[0].message);
  } else res.status(201).send(newContact);
}

async function remove(req, res, next) {
  const id = req.params["contactId"];
  try {
    const data = await Contact.findByIdAndDelete(id).exec();
    if (data === null) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(204).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  const id = req.params["contactId"];
  const { error, value } = schemas.contactUpdateSchema.validate(req.body);
  if (typeof error !== "undefined") {
    res.status(400).json({ message: "missing fields" });
  }
  try {
    const data = await Contact.findByIdAndUpdate(id, value, {
      new: true,
    }).exec();
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
}

async function updateFavorite(req, res, next) {
  const { id } = req.params;
  const { favorite } = req.body;

  if (favorite === undefined) {
    res.status(400).json({ message: "missing field favorite" });
  }

  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );

  if (!result) {
    res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(result);
}

module.exports = {
  get,
  getById,
  add,
  remove,
  update,
  updateFavorite,
};
