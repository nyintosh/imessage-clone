import { ConversationPopulated } from '../../../backend/src/utils/types';

/**
 * Conversation
 */

export type _ConversationPopulated = ConversationPopulated;

export type CreateConversationData = {
	createConversation: {
		conversationId: string;
	};
};

export type CreateConversationInput = {
	participantIds: string[];
};

export type GetConversationsData = {
	getConversations: ConversationPopulated[];
};

/**
 * User
 */

export type CreateUsernameData = {
	createUsername: {
		success: boolean;
	};
};

export type CreateUsernameInput = {
	username: string;
};

export type SearchUsersData = {
	searchUsers: SearchedUser[];
};

export type SearchUsersInput = {
	username: string;
};

export type SearchedUser = {
	id: string;
	image: string;
	username: string;
};
