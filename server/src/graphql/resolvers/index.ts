import merge from 'lodash.merge';
import conversationResolvers from './conversation.js';
import messageResolver from './message.js';
import scalarResolver from './scalar.js';
import userResolver from './user.js';

export const resolvers = merge(
	{},
	conversationResolvers,
	messageResolver,
	scalarResolver,
	userResolver,
);
