import { usersLikeKey } from '$services/keys';
import { client } from '$services/redis';

export const userLikesItem = async (itemId: string, userId: string) => {
	return await client.sIsMember(usersLikeKey(userId), itemId);
};

export const likedItems = async (userId: string) => {};

export const likeItem = async (itemId: string, userId: string) => {
	await client.sAdd(usersLikeKey(userId), itemId);
};

export const unlikeItem = async (itemId: string, userId: string) => {
	await client.sRem(usersLikeKey(userId), itemId);
};

export const commonLikedItems = async (userOneId: string, userTwoId: string) => {};
