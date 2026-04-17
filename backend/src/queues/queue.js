import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL,{ maxRetriesPerRequest: null });

// This is the queue "Producer"
export const submissionQueue = new Queue('submission-queue', { connection });