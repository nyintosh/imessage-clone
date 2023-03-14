import { ParticipantPopulated } from './types.js';

export const isUserConversationParticipant = (
	participants: ParticipantPopulated[],
	userId: string,
) => {
	return participants.some((p) => p.userId === userId);
};
