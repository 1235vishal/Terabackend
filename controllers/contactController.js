const Contact = require('../models/Contact.js');

const createContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const created = await Contact.create({ name, email, phone, subject, message });
        return res.status(201).json({ message: 'Message received', data: created });
    } catch (err) {
        console.error('createContact error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.list();
        return res.status(200).json({ data: contacts });
    } catch (err) {
        console.error('getContacts error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Contact.markRead(id);
        if (!result.affectedRows) return res.status(404).json({ error: 'Contact not found' });
        return res.status(200).json({ message: 'Marked as read' });
    } catch (err) {
        console.error('markAsRead error:', err);
        return res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createContact,
    getContacts,
    markAsRead,
};
