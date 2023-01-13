import { randomBytes } from 'crypto';
import { client } from './client';

export const withLock = async (key: string, cb: (signal: any) => any) => {
	// Intialize a few variable to control retry behaviour
	const retryDelayMs = 100;
	let retries = 20;

	// Generate a random value to store at the lock key
	const token = randomBytes(6).toString('hex');
	// Create a lock key
	const lockKey = `lock:${key}`;

	// Setup a while loop to implement the retry behaviour
	while (retries >= 0) {
		retries--;
		// Try to do a SET NX operation
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: 2000
		});

		if (!acquired) {
			// ELSE brief pause (retryDelayMs) and then retry
			await pause(retryDelayMs);
			continue;
		}

		// If the set is successful, then run the callback
		try {
			const signal: any = {
				expired: false
			};
			setTimeout(() => {
				signal.expired = true;
			}, 2000);
			const result = await cb(signal);
			return result;
		} finally {
			// Unset the locked set
			await client.unlock(lockKey, token);
		}
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
