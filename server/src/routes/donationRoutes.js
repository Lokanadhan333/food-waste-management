import { Router } from 'express';
import {
  listDonations,
  getDonation,
  createDonation,
  requestDonation,
  deleteDonation,
} from '../controllers/donationController.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/', listDonations);
router.get('/:id', getDonation);
router.post('/', formLimiter, createDonation);
router.post('/:id/request', formLimiter, requestDonation);
router.delete('/:id', deleteDonation);

export default router;
