import Route from '../models/Route.js';

// @desc    Get all routes (only future routes)
// @route   GET /api/routes
// @access  Public
export const getRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ 
      isActive: true,
      departureTime: { $gte: new Date() }  // Only show future routes
    }).populate('bus').sort({ departureTime: 1 });  // Sort by departure time
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search routes
// @route   GET /api/routes/search
// @access  Public
export const searchRoutes = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    // Base query: active routes with future departure times
    let query = { 
      isActive: true,
      departureTime: { $gte: new Date() }  // Only show future routes
    };
    
    if (origin) {
      query.origin = { $regex: origin, $options: 'i' };
    }
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.departureTime = {
        $gte: searchDate,
        $lt: nextDay
      };
    }

    const routes = await Route.find(query).populate('bus');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single route
// @route   GET /api/routes/:id
// @access  Public
export const getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('bus');
    if (route) {
      res.json(route);
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a route
// @route   POST /api/routes
// @access  Private/Admin
export const createRoute = async (req, res) => {
  try {
    const { bus, origin, destination, departureTime, arrivalTime, price, availableSeats } = req.body;

    const route = await Route.create({
      bus,
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      bookedSeats: []
    });

    const populatedRoute = await Route.findById(route._id).populate('bus');
    res.status(201).json(populatedRoute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a route
// @route   PUT /api/routes/:id
// @access  Private/Admin
export const updateRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (route) {
      route.bus = req.body.bus || route.bus;
      route.origin = req.body.origin || route.origin;
      route.destination = req.body.destination || route.destination;
      route.departureTime = req.body.departureTime || route.departureTime;
      route.arrivalTime = req.body.arrivalTime || route.arrivalTime;
      route.price = req.body.price || route.price;
      route.availableSeats = req.body.availableSeats !== undefined ? req.body.availableSeats : route.availableSeats;
      route.isActive = req.body.isActive !== undefined ? req.body.isActive : route.isActive;

      const updatedRoute = await route.save();
      const populatedRoute = await Route.findById(updatedRoute._id).populate('bus');
      res.json(populatedRoute);
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a route
// @route   DELETE /api/routes/:id
// @access  Private/Admin
export const deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (route) {
      route.isActive = false;
      await route.save();
      res.json({ message: 'Route removed' });
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
