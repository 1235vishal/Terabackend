const { Router } = require('express');
const { createUpdate, deleteUpdate, getUpdateById, listUpdates, updateUpdate } = require('../controllers/updateController.js');
const { uploadMenuImage } = require('../middleware/upload.js');

const router = Router();

router.get('/', listUpdates);
router.post('/', uploadMenuImage, createUpdate);
router.get('/:id', getUpdateById);
router.put('/:id', uploadMenuImage, updateUpdate);
router.delete('/:id', deleteUpdate);

module.exports = router;
