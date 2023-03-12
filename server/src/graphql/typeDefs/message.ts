const typeDefs = `#graphql
	type Message {
		id: String
		body: String
		sender: User
		createdAt: Date
	}
`;

export default typeDefs;
