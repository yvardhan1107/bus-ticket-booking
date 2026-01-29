import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: [true, 'Bus is required']
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  availableSeats: {
    type: Number,
    required: true
  },
  bookedSeats: [{
    type: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for duration
routeSchema.virtual('duration').get(function() {
  if (this.departureTime && this.arrivalTime) {
    const diff = this.arrivalTime - this.departureTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }
  return null;
});

routeSchema.set('toJSON', { virtuals: true });
routeSchema.set('toObject', { virtuals: true });

const Route = mongoose.model('Route', routeSchema);

export default Route;
