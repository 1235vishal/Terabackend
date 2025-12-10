const Hero = require('../models/Hero.js');

const getHero = async (req, res) => {
    try {
        const latest = await Hero.getLatest();
        res.json({ success: true, data: latest });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to fetch hero' });
    }
};

const setHero = async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        const imageUrl = req.file ? `/uploads/hero/${req.file.filename}` : req.body.imageUrl;
        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }
        const saved = await Hero.updateLatest({ imageUrl, title, subtitle });
        res.json({ success: true, data: saved });
    } catch (e) {
        res.status(500).json({ success: false, message: 'Failed to set hero' });
    }
};

module.exports = {
    getHero,
    setHero,
};

