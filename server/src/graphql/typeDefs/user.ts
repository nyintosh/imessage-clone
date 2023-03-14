import { gql } from 'graphql-tag';

const typeDefs = gql`
	type Query {
		searchUsers(username: String): [User]
	}

	type Mutation {
		createUsername(username: String): CreateUsernameResponse
	}

	type CreateUsernameResponse {
		error: String
		success: Boolean
	}

	type User {
		id: String
		email: String
		emailVerified: Boolean
		image: String
		name: String
		username: String
	}
`;

export default typeDefs;
