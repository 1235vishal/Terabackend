const express = require('express');
const { createContact, getContacts, markAsRead } = require('../controllers/contactController.js');
const router = express.Router();

// Public: submit contact form
router.post('/', createContact);

// Admin: list all contacts
router.get('/', getContacts);

// Admin: mark as read
router.patch('/:id/read', markAsRead);

module.exports = router;
