const Catering = require('../models/Catering.js');

const createCateringRequest = async (req, res, next) => {
    try {
        const { name, phone, email, persons, eventDate, eventLocation, instructions } = req.body;

        if (!name || !phone || !persons || !eventDate || !eventLocation) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const result = await Catering.create({
            name,
            phone,
            email,
            persons,
            eventDate,
            eventLocation,
            instructions,
        });

        return res.status(201).json({
            success: true,
            message: 'Catering request submitted successfully',
            data: { id: result.id },
        });
    } catch (error) {
        next(error);
    }
};

const listCateringRequests = async (req, res, next) => {
    try {
        const data = await Catering.list();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const getCateringRequestById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'Invalid ID' });
        const data = await Catering.findById(id);
        if (!data) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        next(error);
    }
};

const deleteCateringRequest = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'Invalid ID' });
        const deleted = await Catering.remove(id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Not found' });
        return res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCateringRequest,
    listCateringRequests,
    getCateringRequestById,
    deleteCateringRequest,
};
