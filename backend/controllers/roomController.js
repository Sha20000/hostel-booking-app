const Room = require('../models/Room');

// @desc    Create a room
// @route   POST /api/rooms
const createRoom = async (req, res, next) => {
  try {
    const { roomNumber, roomType, pricePerMonth, capacity, description } = req.body;

    if (!roomNumber || !roomType || !pricePerMonth || !capacity) {
      return res.status(400).json({ message: 'roomNumber, roomType, pricePerMonth and capacity are required' });
    }

    const existing = await Room.findOne({ roomNumber });
    if (existing) {
      return res.status(400).json({ message: 'A room with this number already exists' });
    }

    const room = await Room.create({
      roomNumber,
      roomType,
      pricePerMonth,
      capacity,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const { roomType, pricePerMonth, capacity, description, availabilityStatus } = req.body;

    if (roomType) room.roomType = roomType;
    if (pricePerMonth !== undefined) room.pricePerMonth = pricePerMonth;
    if (capacity !== undefined) room.capacity = capacity;
    if (description !== undefined) room.description = description;
    if (availabilityStatus) room.availabilityStatus = availabilityStatus;
    if (req.file) room.image = `/uploads/${req.file.filename}`;

    const updated = await room.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createRoom, getRooms, getRoomById, updateRoom, deleteRoom };
