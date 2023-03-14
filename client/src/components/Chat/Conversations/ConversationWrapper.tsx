import SkeletonLoader from '@/components/common/SkeletonLoader';
import ConversationOperations from '@/graphql/operations/conversation';
import {
	ConversationCreatedSubscriptionData,
	GetConversationsData,
} from '@/utils/types';
import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ConversationList from './ConversationList';

const ConversationWrapper: React.FC = () => {
	const { data: session } = useSession();

	const router = useRouter();

	const { subscribeToMore, data, loading } = useQuery<GetConversationsData>(
		ConversationOperations.Queries.getConversations,
	);

	const subscribeToNewConversations = () => {
		subscribeToMore({
			document: ConversationOperations.Subscriptions.conversationCreated,
			updateQuery: (
				prev,
				{ subscriptionData }: ConversationCreatedSubscriptionData,
			) => {
				if (!subscriptionData?.data) return prev;

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

	const userId = session!.user.id;

	const onViewConversation = async (
		conversationId: string,
		seenLastMessage: boolean | undefined,
	) => {
		router.push({
			query: {
				conversationId,
			},
		});

		if (seenLastMessage) return;
	};

	return (
		<Box
			display={{
				base: router.query.conversationId ? 'none' : 'flex',
				md: 'flex',
			}}
			bg='whiteAlpha.50'
			flexDirection='column'
			gap={4}
			px={3}
			py={6}
			width={{ base: '100%', md: '340px' }}
		>
			{loading ? (
				<SkeletonLoader count={3} height='80px' />
			) : (
				<ConversationList
					onViewConversation={onViewConversation}
					conversations={data?.getConversations || []}
					userId={userId}
				/>
			)}
		</Box>
	);
};

export default ConversationWrapper;
