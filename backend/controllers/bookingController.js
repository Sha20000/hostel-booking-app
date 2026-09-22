const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create a booking request
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { roomId, startDate, endDate } = req.body;

    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({ message: 'roomId, startDate and endDate are required' });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Business rule: cannot request a room that is already full
    if (room.availabilityStatus === 'Full') {
      return res.status(400).json({ message: 'This room is at full capacity and not accepting new bookings' });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'startDate must be before endDate' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      roomId,
      startDate,
      endDate
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in user's booking history
// @route   GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('roomId', 'roomNumber roomType pricePerMonth image')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber roomType')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('roomId')
      .populate('userId', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a booking (admin)
// @route   PUT /api/bookings/:id/approve
const approveBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    const room = await Room.findById(booking.roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Business rule: block approval if room is already full
    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ message: 'Room is already at full capacity' });
    }

    booking.status = 'Approved';
    await booking.save();

    // Business rule: approving increments occupancy and flips status when full
    room.currentOccupancy += 1;
    if (room.currentOccupancy >= room.capacity) {
      room.availabilityStatus = 'Full';
    }
    await room.save();

    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// @desc    Reject a booking (admin)
// @route   PUT /api/bookings/:id/reject
const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    booking.status = 'Rejected';
    await booking.save();
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel a booking (owner)
// @route   DELETE /api/bookings/:id
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.userId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    const wasApproved = booking.status === 'Approved';
    booking.status = 'Cancelled';
    await booking.save();

    // Business rule: cancelling an approved booking releases the occupied slot
    if (wasApproved) {
      const room = await Room.findById(booking.roomId);
      if (room) {
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        room.availabilityStatus = 'Available';
        await room.save();
      }
    }

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  cancelBooking
};
