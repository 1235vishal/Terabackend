const { Router } = require('express');
const uploadHero = require('../middleware/uploadHero.js');
const { getHero, setHero } = require('../controllers/heroController.js');

const router = Router();

router.get('/', getHero);
router.post('/', uploadHero.single('image'), setHero);

module.exports = router;
