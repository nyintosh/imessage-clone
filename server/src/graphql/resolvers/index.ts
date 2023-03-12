import merge from 'lodash.merge';
import conversationResolvers from './conversation.js';
import userResolvers from './user.js';

export const resolvers = merge({}, conversationResolvers, userResolvers);
