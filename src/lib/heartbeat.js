import redis from './redis';

/**
 * Sends a heartbeat pulse to the shared Redis instance.
 * Identifies this node as 'gph' (Graph).
 */
export async function sendHeartbeat() {
  if (!process.env.REDIS_URL) return;
  
  try {
    await redis.set('pulse:gph', Date.now(), 'EX', 300);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Heartbeat pulse failed');
    }
  }
}
