const mongoose = require("mongoose");
const Joi = require("joi");

const contactSchema = new mongoose.Schema({
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
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": `Missing field favorite` }),
});

const schemas = {
  contactSchema,
  updateFavoriteSchema,
};

const Contact = mongoose.model("Contact", contactSchema);

module.exports = { Contact, schemas };
