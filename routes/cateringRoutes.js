const { Router } = require('express');
const { createCateringRequest, deleteCateringRequest, getCateringRequestById, listCateringRequests } = require('../controllers/cateringController.js');

const router = Router();

router.post('/', createCateringRequest);
router.get('/', listCateringRequests);
router.get('/:id', getCateringRequestById);
router.delete('/:id', deleteCateringRequest);

module.exports = router;
