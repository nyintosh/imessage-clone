import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { isUserConversationParticipant } from '../../utils/functions.js';
import {
	GraphQLContext,
	MessagePopulated,
	SendMessageArgs,
	SentMessageSubscriptionPayload,
} from '../../utils/types.js';
import { conversationPopulated } from './conversation.js';

const resolvers = {
	Query: {
		getMessages: async (
			_: any,
			args: { conversationId: string },
			context: GraphQLContext,
		): Promise<MessagePopulated[]> => {
			const { conversationId } = args;
			const { prisma, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			const sessionUserId = session.user.id;
			const conversation = await prisma.conversation.findUnique({
				where: {
					id: conversationId,
				},
				include: conversationPopulated,
			});

			if (!conversation) {
				throw new GraphQLError('Conversation not found');
			}

			if (
				!isUserConversationParticipant(conversation.participants, sessionUserId)
			) {
				throw new GraphQLError('Not authorized!');
			}

			try {
				const messages = await prisma.message.findMany({
					where: {
						conversationId,
					},
					include: messagePopulated,
					orderBy: {
						createdAt: 'desc',
					},
				});

				return messages;
			} catch (error) {
				const err = error as any;

				console.log(`MessageQuery.getMessages() - Error: ${err?.message}`);
				throw new GraphQLError('Error sending message');
			}
		},
	},
	Mutation: {
		sendMessage: async (
			_: any,
			args: SendMessageArgs,
			context: GraphQLContext,
		): Promise<boolean> => {
			const { id, conversationId, senderId, body } = args;
			const { prisma, pubsub, session } = context;

			const sessionUserId = session?.user?.id;

			if (!session?.user || sessionUserId !== senderId) {
				throw new GraphQLError('Not authorized!');
			}

			try {
				const newMessage = await prisma.message.create({
					data: {
						id,
						conversationId,
						senderId,
						body,
					},
					include: messagePopulated,
				});

				const participant = await prisma.conversationParticipant.findFirst({
					where: {
						conversationId,
						userId: senderId,
					},
				});

				const conversation = await prisma.conversation.update({
					where: {
						id: conversationId,
					},
					data: {
						lastMessageId: newMessage.id,
						participants: {
							update: {
								where: {
									id: participant!.id,
								},
								data: {
									seenLastMessage: true,
								},
							},
							updateMany: {
								where: {
									NOT: {
										userId: senderId,
									},
								},
								data: {
									seenLastMessage: false,
								},
							},
						},
					},
					include: conversationPopulated,
				});

				pubsub.publish('MESSAGE_SENT', {
					messageSent: newMessage,
				});

				pubsub.publish('CONVERSATION_UPDATED', {
					conversationUpdated: {
						conversation,
					},
				});

				return true;
			} catch (error) {
				const err = error as any;

				console.log(`MessageMutation.sendMessage() - Error: ${err?.message}`);
				throw new GraphQLError('Error sending message');
			}
		},
	},
	Subscription: {
		messageSent: {
			subscribe: withFilter(
				(_: any, __: any, { pubsub }: GraphQLContext) =>
					pubsub.asyncIterator(['MESSAGE_SENT']),
				(
					payload: SentMessageSubscriptionPayload,
					args: { conversationId: string },
				) => {
					return payload.messageSent.conversationId === args.conversationId;
				},
			),
		},
	},
};

export default resolvers;

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
	sender: {
		select: {
			id: true,
			image: true,
			username: true,
		},
	},
});
