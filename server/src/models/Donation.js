import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true, maxlength: 80 },
    donorPhone: { type: String, required: true, trim: true, maxlength: 20 },
    foodName: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    quantity: { type: String, required: true, trim: true, maxlength: 40 },
    unit: {
      type: String,
      required: true,
      enum: ['plates', 'packets', 'boxes', 'kg', 'litres'],
    },
    category: {
      type: String,
      required: true,
      enum: ['vegetarian', 'non-vegetarian', 'other'],
    },
    preparedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    pickupLocation: { type: String, required: true, trim: true, maxlength: 200 },
    contactNumber: { type: String, required: true, trim: true, maxlength: 20 },
    // Random token returned once to the donor so only they can delete the donation.
    deleteToken: { type: String, required: true, select: false },
    status: {
      type: String,
      enum: ['available', 'requested', 'collected', 'expired'],
      default: 'available',
    },
    requestCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Donation', donationSchema);
