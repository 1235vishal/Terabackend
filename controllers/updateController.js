const Update = require('../models/Update.js');

const listUpdates = async (req, res, next) => {
    try {
        const data = await Update.list();
        return res.status(200).json({ success: true, data });
    } catch (e) { next(e); }
};

const createUpdate = async (req, res, next) => {
    try {
        const { title, description, fullDetails, tag, price } = req.body;
        let { imageUrl } = req.body;
        if (req.file) imageUrl = `/uploads/menu/${req.file.filename}`;
        if (!title || !imageUrl) return res.status(400).json({ success: false, message: 'title and image are required' });
        const { id } = await Update.create({ title, description, fullDetails, tag, price, imageUrl });
        return res.status(201).json({ success: true, message: 'Update created', data: { id } });
    } catch (e) { next(e); }
};

const getUpdateById = async (req, res, next) => {
    try {
        const item = await Update.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, data: item });
    } catch (e) { next(e); }
};

const updateUpdate = async (req, res, next) => {
    try {
        const existing = await Update.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Not found' });
        const { title, description, fullDetails, tag, price } = req.body;
        let imageUrl = undefined;
        if (req.file) imageUrl = `/uploads/menu/${req.file.filename}`;
        const { affectedRows } = await Update.update(req.params.id, { title, description, fullDetails, tag, price, imageUrl });
        if (!affectedRows) return res.status(400).json({ success: false, message: 'No changes applied' });
        const data = await Update.findById(req.params.id);
        return res.status(200).json({ success: true, message: 'Update saved', data });
    } catch (e) { next(e); }
};

const deleteUpdate = async (req, res, next) => {
    try {
        const { affectedRows } = await Update.remove(req.params.id);
        if (!affectedRows) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, message: 'Update deleted' });
    } catch (e) { next(e); }
};

module.exports = {
    listUpdates,
    createUpdate,
    getUpdateById,
    updateUpdate,
    deleteUpdate,
};
