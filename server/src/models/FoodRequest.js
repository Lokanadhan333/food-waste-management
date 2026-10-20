import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema(
  {
    donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
    requesterName: { type: String, required: true, trim: true, maxlength: 80 },
    requesterPhone: { type: String, required: true, trim: true, maxlength: 20 },
    message: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'collected', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('FoodRequest', requestSchema);
