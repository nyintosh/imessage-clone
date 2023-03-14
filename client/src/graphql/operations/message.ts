import { gql } from '@apollo/client';

export const MessageFields = `
	id
	sender {
		id
		image
		username
	}
	body
	createdAt
`;

export default {
	Query: {
		getMessages: gql`
			query GetMessages($conversationId: String!) {
				getMessages(conversationId: $conversationId) {
					${MessageFields}
				}
			}
		`,
	},
	Mutation: {
		sendMessage: gql`
			mutation SendMessage(
				$id: String!
				$conversationId: String!
				$senderId: String!
				$body: String!
			) {
				sendMessage(
					id: $id
					conversationId: $conversationId
					senderId: $senderId
					body: $body
				)
			}
		`,
	},
	Subscription: {
		messageSent: gql`
			subscription MessageSent($conversationId: String!) {
				messageSent(conversationId: $conversationId) {
					${MessageFields}
				}
			}
		`,
	},
};
