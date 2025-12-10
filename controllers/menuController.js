const Menu = require('../models/Menu.js');

const createMenuItem = async (req, res, next) => {
    try {
        const { name } = req.body;
        let imageUrl = req.body.imageUrl || null;

        if (req.file) {
            imageUrl = `/uploads/menu/${req.file.filename}`;
        }

        if (!name || !imageUrl) {
            return res.status(400).json({ success: false, message: 'name and image are required' });
        }

        const { id } = await Menu.create({ name, imageUrl });
        return res.status(201).json({ success: true, message: 'Menu item created', data: { id } });
    } catch (e) {
        next(e);
    }
};

const listMenuItems = async (req, res, next) => {
    try {
        const data = await Menu.list();
        return res.status(200).json({ success: true, data });
    } catch (e) {
        next(e);
    }
};

const deleteMenuItem = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'Invalid ID' });
        const ok = await Menu.remove(id);
        if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, message: 'Deleted' });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    createMenuItem,
    listMenuItems,
    deleteMenuItem,
};
