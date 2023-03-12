import { gql } from '@apollo/client';

const ConversationFields = `
	id
	lastMessage {
		id
		body
		sender {
			id
			image
			username
		}
		createdAt
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
