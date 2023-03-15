import { gql } from '@apollo/client';
import { MessageFields } from './message';

export const ConversationFields = `
	id
	lastMessage {
		${MessageFields}
	}
	participants {
		seenLastMessage
		user {
			id
			image
			username
		}
	}
	updatedAt
`;

export default {
	Queries: {
		getConversations: gql`
			query GetConversations {
				getConversations {
					${ConversationFields}
				}
			}
		`,
	},
	Mutations: {
		createConversation: gql`
			mutation CreateConversation($participantIds: [String]!) {
				createConversation(participantIds: $participantIds) {
					conversationId
				}
			}
		`,
		markConversationAsRead: gql`
			mutation MarkConversationAsRead(
				$conversationId: String!
				$userId: String!
			) {
				markConversationAsRead(conversationId: $conversationId, userId: $userId)
			}
		`,
	},
	Subscriptions: {
		conversationCreated: gql`
			subscription ConversationCreated {
				conversationCreated {
					${ConversationFields}
				}
			}
		`,
	},
};
