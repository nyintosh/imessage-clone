import {
	ConversationPopulated,
	MessagePopulated,
} from '../../../server/src/utils/types';

/**
 * Conversations
 */

export type _ConversationPopulated = ConversationPopulated;

export type GetConversationsData = {
	getConversations: ConversationPopulated[];
};

export type CreateConversationData = {
	createConversation: {
		conversationId: string;
	};
};

export type CreateConversationArgs = {
	participantIds: string[];
};

export type ConversationCreatedSubscriptionData = {
	conversationCreated: {
		conversation: _ConversationPopulated;
	};
};

export type ConversationUpdatedSubscriptionData = {
	conversationUpdated: {
		conversation: _ConversationPopulated;
	};
};

export type MarkConversationAsReadData = {
	markConversationAsRead: boolean;
};

export type MarkConversationAsReadArgs = {
	conversationId: string;
	userId: string;
};

/**
 * Messages
 */

export type _MessagePopulated = MessagePopulated;

export type GetMessagesData = {
	getMessages: MessagePopulated[];
};

export type GetMessagesArgs = {
	conversationId: string;
};

export type SendMessageData = {
	sendMessage: boolean;
};

export type SendMessageArgs = {
	id: string;
	conversationId: string;
	senderId: string;
	body: string;
};

export type MessageSentSubscriptionData = {
	subscriptionData: {
		data: {
			messageSent: MessagePopulated;
		};
	};
};

/**
 * Users
 */

export type SearchUsersData = {
	searchUsers: SearchedUser[];
};

export type SearchUsersArgs = {
	username: string;
};

export type CreateUsernameData = {
	createUsername: boolean;
};

export type CreateUsernameArgs = {
	username: string;
};

export type SearchedUser = {
	id: string;
	image: string;
	username: string;
};
