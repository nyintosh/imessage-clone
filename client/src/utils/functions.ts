import { ParticipantPopulated } from '../../../backend/src/utils/types';

export const formatUsernames = (
	activeUserId: string,
	participants: ParticipantPopulated[],
): string => {
	const usernames = participants
		.filter(({ user }) => user.id !== activeUserId)
		.map(({ user }) => user.username)
		.join(', ');

	return usernames;
};
