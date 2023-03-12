import ConversationOperations from '@/graphql/operations/conversation';
import { GetConversationsData, _ConversationPopulated } from '@/utils/types';
import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ConversationList from './ConversationList';

const ConversationWrapper: React.FC = () => {
	const router = useRouter();

	const { data, subscribeToMore } = useQuery<GetConversationsData>(
		ConversationOperations.Queries.getConversations,
	);

	const subscribeToNewConversations = () => {
		subscribeToMore({
			document: ConversationOperations.Subscriptions.conversationCreated,
			updateQuery: (
				prev,
				{
					subscriptionData,
				}: {
					subscriptionData: {
						data: {
							conversationCreated: _ConversationPopulated;
						};
					};
				},
			) => {
				if (!subscriptionData.data) return prev;

				const newConversation = subscriptionData.data.conversationCreated;

				return {
					...prev,
					getConversations: [newConversation, ...prev.getConversations],
				};
			},
		});
	};

	useEffect(() => {
		subscribeToNewConversations();
	}, []);

	const onViewConversation = async (conversationId: string) => {
		router.push({
			query: {
				conversationId,
			},
		});
	};

	return (
		<Box
			display={{
				base: router.query.conversationId ? 'none' : 'flex',
				md: 'flex',
			}}
			width={{ base: '100%', md: '400px' }}
			bg='whiteAlpha.50'
			px={3}
			py={6}
		>
			<ConversationList
				onViewConversation={onViewConversation}
				conversations={data?.getConversations || []}
			/>
		</Box>
	);
};

export default ConversationWrapper;
