import { contactStore } from '../store/dataStore.js';
import { validateContact } from '../middleware/validate.js';

/** POST /api/contact */
export async function createContactMessage(req, res, next) {
  try {
    const { errors, data } = validateContact(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed.', details: errors });
    }

    await contactStore.create(data);

    res.status(201).json({
      success: true,
      message: 'Thanks for reaching out! We will get back to you soon.',
    });
  } catch (error) {
    next(error);
  }
}
