const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBooking,
  approveBooking,
  rejectBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/', protect, admin, getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.put('/:id/approve', protect, admin, approveBooking);
router.put('/:id/reject', protect, admin, rejectBooking);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
