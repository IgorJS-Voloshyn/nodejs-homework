const express = require('express')
const fs = require("node:fs/promises")
const path = require("node:path")
const app = express()


const ContactsController = require("../../controllers/contacts.js");

const router = express.Router()

router.get('/', ContactsController.get )

router.get('/:contactId', ContactsController.getById)

const jsonParser = express.json();

router.post('/', jsonParser, ContactsController.add)

router.delete('/:contactId', ContactsController.remove)

router.put('/:contactId', jsonParser, ContactsController.update)

router.patch('/:contactId/favorite', jsonParser, ContactsController.updateFavorite)

module.exports = router
