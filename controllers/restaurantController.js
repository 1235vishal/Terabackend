const Restaurant = require('../models/Restaurant.js');

const createRestaurant = async (req, res, next) => {
    try {
        const { name, branches, description, phone, hours } = req.body;
        let { imageUrl } = req.body;
        let locations = [];
        let whyChooseUs = [];
        try { locations = JSON.parse(req.body.locations || '[]'); } catch { locations = []; }
        try { whyChooseUs = JSON.parse(req.body.whyChooseUs || '[]'); } catch { whyChooseUs = []; }

        if (req.file) {
            imageUrl = `/uploads/menu/${req.file.filename}`;
        }

        if (!name || !imageUrl) {
            return res.status(400).json({ success: false, message: 'name and image are required' });
        }

        const { id } = await Restaurant.create({ name, branches, imageUrl, locations, description, whyChooseUs, phone, hours });
        return res.status(201).json({ success: true, message: 'Restaurant created', data: { id } });
    } catch (e) {
        next(e);
    }
};

const listRestaurants = async (req, res, next) => {
    try {
        const data = await Restaurant.list();
        return res.status(200).json({ success: true, data });
    } catch (e) {
        next(e);
    }
};

const getRestaurantById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const item = await Restaurant.findById(id);
        if (!item) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, data: item });
    } catch (e) {
        next(e);
    }
};

const updateRestaurant = async (req, res, next) => {
    try {
        const id = req.params.id;
        const existing = await Restaurant.findById(id);
        if (!existing) return res.status(404).json({ success: false, message: 'Not found' });

        // Collect fields
        const { name, branches, description, phone, hours } = req.body;
        let imageUrl = undefined;
        let locations = undefined;
        let whyChooseUs = undefined;
        if (req.body.locations !== undefined) {
            try { locations = JSON.parse(req.body.locations || '[]'); } catch { locations = []; }
        }
        if (req.body.whyChooseUs !== undefined) {
            try { whyChooseUs = JSON.parse(req.body.whyChooseUs || '[]'); } catch { whyChooseUs = []; }
        }
        if (req.file) {
            imageUrl = `/uploads/menu/${req.file.filename}`;
        }

        const { affectedRows } = await Restaurant.update(id, { name, branches, imageUrl, locations, description, whyChooseUs, phone, hours });
        if (!affectedRows) return res.status(400).json({ success: false, message: 'No changes applied' });
        const updated = await Restaurant.findById(id);
        return res.status(200).json({ success: true, message: 'Restaurant updated', data: updated });
    } catch (e) {
        next(e);
    }
};

const deleteRestaurant = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { affectedRows } = await Restaurant.remove(id);
        if (!affectedRows) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, message: 'Restaurant deleted' });
    } catch (e) {
        next(e);
    }
};

module.exports = {
    createRestaurant,
    listRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
};
