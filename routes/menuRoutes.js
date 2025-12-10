const { Router } = require('express');
const { createMenuItem, deleteMenuItem, listMenuItems } = require('../controllers/menuController.js');
const { uploadMenuImage } = require('../middleware/upload.js');

const router = Router();

router.get('/', listMenuItems);
router.post('/', uploadMenuImage, createMenuItem);
router.delete('/:id', deleteMenuItem);

module.exports = router;
