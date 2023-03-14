import { ParticipantPopulated } from '../../../server/src/utils/types';

export const formatUsernames = (
	participants: ParticipantPopulated[],
	userId: string,
): string => {
	const usernames = participants
		.filter(({ user }) => user.id !== userId)
		.map(({ user }) => user.username)
		.join(', ');

	return usernames;
};
