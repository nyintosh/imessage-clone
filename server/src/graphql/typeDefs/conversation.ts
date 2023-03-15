import { gql } from 'graphql-tag';

const typeDefs = gql`
	scalar Date

	type Query {
		getConversations: [Conversation]
	}

	type Mutation {
		createConversation(participantIds: [String]): CreateConversationResponse
		markConversationAsRead(conversationId: String, userId: String): Boolean
	}

	type Subscription {
		conversationCreated: ConversationCreatedSubscriptionPayload
		conversationUpdated: ConversationUpdatedSubscriptionPayload
	}

	type Conversation {
		id: String
		lastMessage: Message
		participants: [Participant]
		createdAt: Date
		updatedAt: Date
	}

	type Participant {
		id: String
		seenLastMessage: Boolean
		user: User
	}

	type CreateConversationResponse {
		conversationId: String
	}

	type ConversationCreatedSubscriptionPayload {
		conversation: Conversation
	}

	type ConversationUpdatedSubscriptionPayload {
		conversation: Conversation
	}
`;

export default typeDefs;
