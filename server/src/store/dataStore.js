import crypto from 'crypto';
import mongoose from 'mongoose';
import Donation from '../models/Donation.js';
import FoodRequest from '../models/FoodRequest.js';
import ContactMessage from '../models/ContactMessage.js';
import { isDatabaseConnected } from '../config/db.js';
import { memoryStore } from './memoryStore.js';

/**
 * Data access layer.
 * Uses MongoDB/Mongoose when connected, otherwise the in-memory store.
 * Controllers only talk to this file, so switching stores is painless.
 */

const toPlain = (doc) => (doc && typeof doc.toObject === 'function' ? doc.toObject() : doc);

function markExpiredIfPassed(donation) {
  if (donation.status !== 'collected' && new Date(donation.expiresAt) < new Date()) {
    donation.status = 'expired';
  }
  return donation;
}

// ---------------------------------------------------------------- donations

export const donationStore = {
  async list() {
    if (isDatabaseConnected()) {
      const docs = await Donation.find().sort({ createdAt: -1 });
      // Lazily mark anything past its deadline as expired.
      await Donation.updateMany(
        { expiresAt: { $lt: new Date() }, status: { $in: ['available', 'requested'] } },
        { $set: { status: 'expired' } }
      );
      return docs.map((d) => toPlain(d));
    }

    return [...memoryStore.donations.values()]
      .map(markExpiredIfPassed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    if (isDatabaseConnected()) {
      if (!mongoose.isValidObjectId(id)) return null;
      const doc = await Donation.findById(id).select('+deleteToken');
      return doc ? toPlain(doc) : null;
    }

    const donation = memoryStore.donations.get(id);
    return donation ? markExpiredIfPassed(donation) : null;
  },

  async create(data) {
    const deleteToken = crypto.randomBytes(24).toString('hex');

    if (isDatabaseConnected()) {
      const doc = await Donation.create({ ...data, deleteToken });
      const plain = toPlain(doc);
      delete plain.deleteToken;
      plain.deleteToken = deleteToken; // returned once to the donor
      return plain;
    }

    const donation = {
      _id: memoryStore.newId(),
      ...data,
      deleteToken,
      status: 'available',
      requestCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.donations.set(donation._id, donation);
    return { ...donation };
  },

  async remove(id, deleteToken) {
    if (!deleteToken) return { removed: false, reason: 'missing-token' };

    if (isDatabaseConnected()) {
      if (!mongoose.isValidObjectId(id)) return { removed: false, reason: 'not-found' };
      const doc = await Donation.findById(id).select('+deleteToken');
      if (!doc) return { removed: false, reason: 'not-found' };
      if (doc.deleteToken !== deleteToken) return { removed: false, reason: 'forbidden' };
      await doc.deleteOne();
      return { removed: true };
    }

    const donation = memoryStore.donations.get(id);
    if (!donation) return { removed: false, reason: 'not-found' };
    if (donation.deleteToken !== deleteToken) return { removed: false, reason: 'forbidden' };
    memoryStore.donations.delete(id);
    return { removed: true };
  },

  async markRequested(id) {
    if (isDatabaseConnected()) {
      return Donation.findByIdAndUpdate(
        id,
        { $set: { status: 'requested' }, $inc: { requestCount: 1 } },
        { new: true }
      );
    }

    const donation = memoryStore.donations.get(id);
    if (donation) {
      donation.status = 'requested';
      donation.requestCount = (donation.requestCount || 0) + 1;
      donation.updatedAt = new Date().toISOString();
    }
    return donation;
  },
};

// ----------------------------------------------------------------- requests

export const requestStore = {
  async create({ donationId, requesterName, requesterPhone, message }) {
    if (isDatabaseConnected()) {
      const doc = await FoodRequest.create({
        donation: donationId,
        requesterName,
        requesterPhone,
        message,
      });
      return toPlain(doc);
    }

    const request = {
      _id: memoryStore.newId(),
      donation: donationId,
      requesterName,
      requesterPhone,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    memoryStore.requests.set(request._id, request);
    return { ...request };
  },
};

// ----------------------------------------------------------------- contacts

export const contactStore = {
  async create({ name, email, message }) {
    if (isDatabaseConnected()) {
      const doc = await ContactMessage.create({ name, email, message });
      return toPlain(doc);
    }

    const saved = {
      _id: memoryStore.newId(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };
    memoryStore.messages.set(saved._id, saved);
    return { ...saved };
  },
};
