/**
 * Small hand-written validation helpers (no extra dependencies needed).
 */

export function isNonEmptyString(value, max = 500) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
}

const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isPhone(value) {
  return typeof value === 'string' && PHONE_REGEX.test(value.trim());
}

export function isEmail(value) {
  return typeof value === 'string' && EMAIL_REGEX.test(value.trim());
}

export const CATEGORIES = ['vegetarian', 'non-vegetarian', 'other'];
export const UNITS = ['plates', 'packets', 'boxes', 'kg', 'litres'];

/**
 * Validates the body of POST /api/donations.
 * Returns an object with a `errors` array. When the array is empty the
 * cleaned donation data is returned in `data`.
 */
export function validateDonation(body = {}) {
  const errors = [];
  const clean = {};

  if (!isNonEmptyString(body.donorName, 80)) {
    errors.push('Donor name is required (max 80 characters).');
  } else {
    clean.donorName = body.donorName.trim();
  }

  if (!isPhone(body.donorPhone)) {
    errors.push('A valid contact number is required.');
  } else {
    clean.donorPhone = body.donorPhone.trim();
  }

  if (!isNonEmptyString(body.foodName, 120)) {
    errors.push('Food name is required (max 120 characters).');
  } else {
    clean.foodName = body.foodName.trim();
  }

  if (!isNonEmptyString(body.description, 1000)) {
    errors.push('Food description is required (max 1000 characters).');
  } else {
    clean.description = body.description.trim();
  }

  if (!isNonEmptyString(body.quantity, 40)) {
    errors.push('Food quantity is required.');
  } else {
    clean.quantity = body.quantity.trim();
  }

  if (!UNITS.includes(body.unit)) {
    errors.push(`Unit must be one of: ${UNITS.join(', ')}.`);
  } else {
    clean.unit = body.unit;
  }

  if (!CATEGORIES.includes(body.category)) {
    errors.push('Category must be vegetarian, non-vegetarian or other.');
  } else {
    clean.category = body.category;
  }

  const preparedAt = new Date(body.preparedAt);
  if (!body.preparedAt || Number.isNaN(preparedAt.getTime())) {
    errors.push('A valid preparation date and time is required.');
  } else {
    clean.preparedAt = preparedAt;
  }

  const expiresAt = new Date(body.expiresAt);
  if (!body.expiresAt || Number.isNaN(expiresAt.getTime())) {
    errors.push('A valid safe-consumption deadline is required.');
  } else if (expiresAt.getTime() <= Date.now()) {
    errors.push('The safe-consumption deadline must be in the future. Expired food cannot be donated.');
  } else if (preparedAt && expiresAt.getTime() <= preparedAt.getTime()) {
    errors.push('The deadline must be later than the preparation time.');
  } else {
    clean.expiresAt = expiresAt;
  }

  if (!isNonEmptyString(body.pickupLocation, 200)) {
    errors.push('Pickup location is required (max 200 characters).');
  } else {
    clean.pickupLocation = body.pickupLocation.trim();
  }

  if (!isPhone(body.contactNumber)) {
    errors.push('A valid pickup contact number is required.');
  } else {
    clean.contactNumber = body.contactNumber.trim();
  }

  return { errors, data: clean };
}

/**
 * Validates POST /api/donations/:id/request
 */
export function validateRequest(body = {}) {
  const errors = [];
  const clean = {};

  if (!isNonEmptyString(body.requesterName, 80)) {
    errors.push('Your name is required (max 80 characters).');
  } else {
    clean.requesterName = body.requesterName.trim();
  }

  if (!isPhone(body.requesterPhone)) {
    errors.push('A valid contact number is required.');
  } else {
    clean.requesterPhone = body.requesterPhone.trim();
  }

  if (body.message !== undefined && body.message !== null) {
    if (!isNonEmptyString(body.message, 500) && String(body.message).trim() !== '') {
      errors.push('Message must be at most 500 characters.');
    } else {
      clean.message = String(body.message).trim();
    }
  }

  return { errors, data: clean };
}

/**
 * Validates POST /api/contact
 */
export function validateContact(body = {}) {
  const errors = [];
  const clean = {};

  if (!isNonEmptyString(body.name, 80)) {
    errors.push('Your name is required.');
  } else {
    clean.name = body.name.trim();
  }

  if (!isEmail(body.email)) {
    errors.push('A valid email address is required.');
  } else {
    clean.email = body.email.trim();
  }

  if (!isNonEmptyString(body.message, 2000)) {
    errors.push('A message is required (max 2000 characters).');
  } else {
    clean.message = body.message.trim();
  }

  return { errors, data: clean };
}
