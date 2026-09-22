const express = require('express');
const router = express.Router();
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', protect, admin, upload.single('image'), createRoom);
router.put('/:id', protect, admin, upload.single('image'), updateRoom);
router.delete('/:id', protect, admin, deleteRoom);

module.exports = router;
