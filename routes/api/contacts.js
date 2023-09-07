const express = require("express");

const ContactsController = require("../../controllers/contacts.js");
const schemas = require("../../models/contacts.js");
const validateBody = require("../../middleware/validateBody.js");
const router = express.Router();

router.get("/", ContactsController.get);

router.get("/:contactId", ContactsController.getById);

const jsonParser = express.json();

router.post(
  "/",
  jsonParser,
  validateBody(schemas.contactSchema),
  ContactsController.add
);

router.delete("/:contactId", ContactsController.remove);

router.put(
  "/:contactId",
  jsonParser,
  validateBody(schemas.contactSchema),
  ContactsController.update
);

router.patch(
  "/:contactId/favorite",
  jsonParser,
  validateBody(schemas.updateFavoriteSchema),
  ContactsController.updateFavorite
);

module.exports = router;
