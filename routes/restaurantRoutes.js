const { Router } = require('express');
const { createRestaurant, deleteRestaurant, getRestaurantById, listRestaurants, updateRestaurant } = require('../controllers/restaurantController.js');
const { uploadMenuImage } = require('../middleware/upload.js');

const router = Router();

router.get('/', listRestaurants);
router.post('/', uploadMenuImage, createRestaurant);
router.get('/:id', getRestaurantById);
router.put('/:id', uploadMenuImage, updateRestaurant);
router.delete('/:id', deleteRestaurant);

module.exports = router;
