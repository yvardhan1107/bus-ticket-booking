import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true,
    trim: true
  },
  busType: {
    type: String,
    required: [true, 'Bus type is required'],
    enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Volvo'],
    default: 'AC'
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: 1,
    max: 60
  },
  amenities: [{
    type: String
  }],
  operator: {
    type: String,
    required: [true, 'Operator name is required'],
    trim: true
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Bus = mongoose.model('Bus', busSchema);

export default Bus;
