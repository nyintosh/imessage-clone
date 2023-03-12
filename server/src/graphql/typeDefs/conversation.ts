const typeDefs = `#graphql
	scalar Date

	type Query {
		getConversations: [Conversation]
	}

	type Mutation {
		createConversation(participantIds: [String]): CreateConversationResponse
	}

	type Subscription {
		conversationCreated: Conversation
	}

	type Conversation {
		id: String
		lastMessage: Message
		participants: [Participant]
		createdAt: Date
		updatedAt: Date
	}

	type CreateConversationResponse {
		conversationId: String
	}
	
	type Participant {
		id: String
		seenLastMessage: Boolean
		user: User
	}
`;

export default typeDefs;
