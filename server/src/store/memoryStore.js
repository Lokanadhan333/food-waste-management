import { randomUUID } from 'crypto';

/**
 * In-memory store used when MongoDB is not configured.
 * Data lives only until the server restarts - for local development only.
 */
const donations = new Map();
const requests = new Map();
const messages = new Map();

export const memoryStore = {
  donations,
  requests,
  messages,
  newId: () => randomUUID(),
};
