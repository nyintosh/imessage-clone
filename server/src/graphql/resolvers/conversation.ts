import { Prisma } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { isUserConversationParticipant } from '../../utils/functions.js';
import {
	ConversationCreatedSubscriptionPayload,
	ConversationPopulated,
	ConversationUpdatedSubscriptionPayload,
	GraphQLContext,
} from '../../utils/types.js';

const resolvers = {
	Query: {
		getConversations: async (
			_: any,
			__: any,
			context: GraphQLContext,
		): Promise<ConversationPopulated[]> => {
			const { prisma, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			const sessionUserId = session.user.id;

			try {
				const conversations = await prisma.conversation.findMany({
					where: {
						participants: {
							some: {
								userId: {
									equals: sessionUserId,
								},
							},
						},
					},
					include: conversationPopulated,
				});

				console.log(conversations);

				return conversations;
			} catch (error) {
				const err = error as any;

				console.log(
					`ConversationQuery.conversations() - Error: ${err?.message}`,
				);
				throw new GraphQLError(err?.message);
			}
		},
	},
	Mutation: {
		createConversation: async (
			_: any,
			args: { participantIds: string[] },
			context: GraphQLContext,
		): Promise<{ conversationId: string }> => {
			const { participantIds } = args;
			const { prisma, pubsub, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			const sessionUserId = session.user.id;

			try {
				const conversation = await prisma.conversation.create({
					data: {
						participants: {
							createMany: {
								data: participantIds.map((pid) => ({
									userId: pid,
									seenLastMessage: pid === sessionUserId,
								})),
							},
						},
					},
					include: conversationPopulated,
				});

				pubsub.publish('CONVERSATION_CREATED', {
					conversationCreated: {
						conversation,
					},
				});

				return {
					conversationId: conversation.id,
				};
			} catch (error) {
				const err = error as any;

				console.log(
					`ConversationMutation.createConversation() - Error: ${err?.message}`,
				);
				throw new GraphQLError('Error creating conversation');
			}
		},
		markConversationAsRead: async (
			_: any,
			args: { conversationId: string; userId: string },
			context: GraphQLContext,
		): Promise<boolean> => {
			const { conversationId, userId } = args;
			const { prisma, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			try {
				const participant = await prisma.conversationParticipant.findFirst({
					where: {
						conversationId,
						userId,
					},
				});

				await prisma.conversationParticipant.update({
					where: {
						id: participant!.id,
					},
					data: {
						seenLastMessage: true,
					},
				});

				return true;
			} catch (error) {
				const err = error as any;

				console.log(
					`ConversationMutation.markConversationAsRead() - Error: ${err?.message}`,
				);
				throw new GraphQLError('Error creating conversation');
			}
		},
	},
	Subscription: {
		conversationCreated: {
			subscribe: withFilter(
				(_: any, __: any, { pubsub }: GraphQLContext) =>
					pubsub.asyncIterator(['CONVERSATION_CREATED']),
				(
					payload: ConversationCreatedSubscriptionPayload,
					_: any,
					context: GraphQLContext,
				) => {
					const { session } = context;
					const { participants } = payload.conversationCreated.conversation;

					const sessionUserId = session!.user!.id;

					const isUserParticipant = isUserConversationParticipant(
						participants,
						sessionUserId,
					);

					return isUserParticipant;
				},
			),
		},
		conversationUpdated: {
			subscribe: withFilter(
				(_: any, __: any, { pubsub }: GraphQLContext) =>
					pubsub.asyncIterator(['CONVERSATION_UPDATED']),
				(
					payload: ConversationUpdatedSubscriptionPayload,
					_: any,
					context: GraphQLContext,
				) => {
					const { session } = context;

					const { participants } = payload.conversationUpdated.conversation;

					const sessionUserId = session!.user!.id;

					const isUserParticipant = isUserConversationParticipant(
						participants,
						sessionUserId,
					);

					return isUserParticipant;
				},
			),
		},
	},
};

export const participantPopulated =
	Prisma.validator<Prisma.ConversationParticipantInclude>()({
		user: {
			select: {
				id: true,
				image: true,
				username: true,
			},
		},
	});

export const conversationPopulated =
	Prisma.validator<Prisma.ConversationInclude>()({
		participants: {
			include: participantPopulated,
		},
		lastMessage: {
			include: {
				sender: {
					select: {
						id: true,
						image: true,
						username: true,
					},
				},
			},
		},
	});

export default resolvers;
