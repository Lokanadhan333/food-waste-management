import { donationStore, requestStore } from '../store/dataStore.js';
import { validateDonation, validateRequest } from '../middleware/validate.js';

/** GET /api/donations */
export async function listDonations(req, res, next) {
  try {
    const donations = await donationStore.list();

    // Public listing: never expose the delete token.
    const safe = donations.map((d) => {
      const { deleteToken, ...rest } = d;
      return rest;
    });

    res.json({ success: true, count: safe.length, donations: safe });
  } catch (error) {
    next(error);
  }
}

/** GET /api/donations/:id */
export async function getDonation(req, res, next) {
  try {
    const donation = await donationStore.getById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found.' });
    }

    const { deleteToken, ...safe } = donation;
    res.json({ success: true, donation: safe });
  } catch (error) {
    next(error);
  }
}

/** POST /api/donations */
export async function createDonation(req, res, next) {
  try {
    const { errors, data } = validateDonation(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }

    const donation = await donationStore.create(data);

    // The delete token is returned exactly once so the donor can delete later.
    res.status(201).json({
      success: true,
      message: 'Thank you! Your food donation has been listed.',
      donation,
      deleteToken: donation.deleteToken,
    });
  } catch (error) {
    next(error);
  }
}

/** POST /api/donations/:id/request */
export async function requestDonation(req, res, next) {
  try {
    const donation = await donationStore.getById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found.' });
    }

    if (new Date(donation.expiresAt) < new Date()) {
      return res.status(400).json({ error: 'This food has expired and can no longer be requested.' });
    }

    if (donation.status === 'collected') {
      return res.status(400).json({ error: 'This food has already been collected.' });
    }

    const { errors, data } = validateRequest(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }

    const request = await requestStore.create({ donationId: donation._id, ...data });
    await donationStore.markRequested(donation._id);

    // The donor's phone number is private - it is only shared with
    // people who actually submit a request.
    res.status(201).json({
      success: true,
      message: `Your request was sent to the donor of "${donation.foodName}". Please call the pickup contact to confirm.`,
      pickupContact: donation.contactNumber,
      request,
    });
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/donations/:id  (requires the X-Delete-Token header) */
export async function deleteDonation(req, res, next) {
  try {
    const deleteToken = req.get('x-delete-token');
    const result = await donationStore.remove(req.params.id, deleteToken);

    if (!result.removed) {
      if (result.reason === 'forbidden' || result.reason === 'missing-token') {
        return res
          .status(403)
          .json({ error: 'Not authorized to delete this donation. The valid X-Delete-Token header is required.' });
      }
      return res.status(404).json({ error: 'Donation not found.' });
    }

    res.json({ success: true, message: 'Donation deleted.' });
  } catch (error) {
    next(error);
  }
}
