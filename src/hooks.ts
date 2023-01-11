import { useCachePage, useErrors, useSession } from '$services/middlewares';
import '$services/redis/client';
import type { GetSession, Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import boxen from 'boxen';
import 'dotenv/config';
import { DateTime } from 'luxon';

if (!process.env.REDIS_HOST) {
	console.error(
		boxen('You must specify Redis connection info in the .env file', {
			padding: 1,
			margin: 1,
			borderStyle: 'double'
		})
	);
	process.exit(1);
}

export const handle: Handle = sequence(useErrors, useCachePage, useSession);

export const getSession: GetSession = (event) => {
	return event.locals.session;
};

DateTime.prototype.toString = function () {
	return this.toMillis();
};

DateTime.prototype.toJSON = function () {
	return this.toMillis();
};
