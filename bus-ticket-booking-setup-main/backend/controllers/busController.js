import Bus from '../models/Bus.js';

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
export const getBuses = async (req, res) => {
  try {
    const buses = await Bus.find({ isActive: true });
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bus
// @route   GET /api/buses/:id
// @access  Public
export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (bus) {
      res.json(bus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a bus
// @route   POST /api/buses
// @access  Private/Admin
export const createBus = async (req, res) => {
  try {
    const { busName, busNumber, busType, totalSeats, amenities, operator, images } = req.body;

    const bus = await Bus.create({
      busName,
      busNumber,
      busType,
      totalSeats,
      amenities,
      operator,
      images: images || []
    });

    res.status(201).json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (bus) {
      bus.busName = req.body.busName || bus.busName;
      bus.busNumber = req.body.busNumber || bus.busNumber;
      bus.busType = req.body.busType || bus.busType;
      bus.totalSeats = req.body.totalSeats || bus.totalSeats;
      bus.amenities = req.body.amenities || bus.amenities;
      bus.operator = req.body.operator || bus.operator;
      bus.images = req.body.images || bus.images;
      bus.isActive = req.body.isActive !== undefined ? req.body.isActive : bus.isActive;

      const updatedBus = await bus.save();
      res.json(updatedBus);
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (bus) {
      bus.isActive = false;
      await bus.save();
      res.json({ message: 'Bus removed' });
    } else {
      res.status(404).json({ message: 'Bus not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
