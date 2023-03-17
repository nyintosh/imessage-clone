import { User } from '@prisma/client';
import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../../utils/types.js';

const resolvers = {
	Query: {
		searchUsers: async (
			_: any,
			args: { username: string },
			context: GraphQLContext,
		): Promise<Array<User>> => {
			const { username: searchedUsername } = args;
			const { prisma, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			const sessionUsername = session.user.username;

			try {
				const users = await prisma.user.findMany({
					where: {
						username: {
							contains: searchedUsername,
							not: sessionUsername,
							mode: 'insensitive',
						},
					},
				});

				return users;
			} catch (error) {
				const err = error as any;

				console.log(`UserQuery.searchUsers() - Error: ${err}`);
				throw new GraphQLError(err?.message);
			}
		},
	},
	Mutation: {
		createUsername: async (
			_: any,
			args: { username: string },
			context: GraphQLContext,
		): Promise<boolean> => {
			const { username } = args;
			const { prisma, session } = context;

			if (!session?.user) {
				throw new GraphQLError('Not authorized!');
			}

			const sessionUserId = session.user.id;

			try {
				const isUserExist = await prisma?.user.findUnique({
					where: {
						username,
					},
				});

				if (isUserExist) {
					throw new GraphQLError('Username already taken');
				}

				await prisma?.user.update({
					where: {
						id: sessionUserId,
					},
					data: {
						username,
					},
				});

				return true;
			} catch (error) {
				const err = error as any;

				console.log(`UserMutation.createUsername() - Error: ${err}`);
				throw new GraphQLError(err?.message);
			}
		},
	},
};

export default resolvers;
