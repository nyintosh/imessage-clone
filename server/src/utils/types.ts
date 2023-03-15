import { Prisma, PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws';
import { ISODateString } from 'next-auth';
import {
	conversationPopulated,
	participantPopulated,
} from '../graphql/resolvers/conversation.js';
import { messagePopulated } from '../graphql/resolvers/message.js';

/**
 * Server Configs
 */

export type GraphQLContext = {
	prisma: PrismaClient;
	pubsub: PubSub;
	session: Session | null;
};

export type Session = {
	user?: User;
	expires: ISODateString;
};

export type SubscriptionContext = Context & {
	connectionParams: {
		session?: Session;
	};
};

/**
 * Conversations
 */

export type ConversationCreatedSubscriptionPayload = {
	conversationCreated: {
		conversation: ConversationPopulated;
	};
};

export type ConversationUpdatedSubscriptionPayload = {
	conversationUpdated: {
		conversation: ConversationPopulated;
	};
};

export type ConversationPopulated = Prisma.ConversationGetPayload<{
	include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
	include: typeof participantPopulated;
}>;

/**
 * Messages
 */

export type MessagePopulated = Prisma.MessageGetPayload<{
	include: typeof messagePopulated;
}>;

export type SendMessageArgs = {
	id: string;
	conversationId: string;
	senderId: string;
	body: string;
};

export type SentMessageSubscriptionPayload = {
	messageSent: MessagePopulated;
};

/**
 * Users
 */

export type User = {
	id: string;
	email: string;
	emailVerified: boolean;
	image: string;
	name: string;
	username: string;
};

export type CreateUsernameResponse = {
	success: boolean;
};
