import SkeletonLoader from '@/components/common/SkeletonLoader';
import ConversationOperations from '@/graphql/operations/conversation';
import {
	ConversationCreatedSubscriptionData,
	ConversationUpdatedSubscriptionData,
	GetConversationsData,
	MarkConversationAsReadArgs,
	MarkConversationAsReadData,
} from '@/utils/types';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Box } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ParticipantPopulated } from '../../../../../server/src/utils/types';
import ConversationList from './ConversationList';

const ConversationWrapper: React.FC = () => {
	const { data: session } = useSession();

	const router = useRouter();

	const { conversationId } = router.query;
	const sessionUserId = session!.user!.id;

	const { subscribeToMore, data, loading } = useQuery<GetConversationsData>(
		ConversationOperations.Queries.getConversations,
	);

	const [markConversationAsRead] = useMutation<
		MarkConversationAsReadData,
		MarkConversationAsReadArgs
	>(ConversationOperations.Mutations.markConversationAsRead);

	useSubscription<ConversationUpdatedSubscriptionData>(
		ConversationOperations.Subscriptions.conversationUpdated,
		{
			onData: ({ client, data: { data } }) => {
				if (!data) return;

				const newConversation = data.conversationUpdated.conversation;

				if (newConversation.id === conversationId) {
					onViewConversation(conversationId as string, false);
				}
			},
		},
	);

	const subscribeToNewConversations = () => {
		subscribeToMore<ConversationCreatedSubscriptionData>({
			document: ConversationOperations.Subscriptions.conversationCreated,
			updateQuery: (prev, { subscriptionData: { data } }) => {
				if (!data) return prev;

				const newConversation = data.conversationCreated.conversation;

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

		try {
			await markConversationAsRead({
				variables: {
					conversationId,
					userId: sessionUserId,
				},
				optimisticResponse: {
					markConversationAsRead: true,
				},
				update: (cache) => {
					const participantFrag = cache.readFragment<{
						participants: ParticipantPopulated[];
					}>({
						id: `Conversation:${conversationId}`,
						fragment: gql`
							fragment participants on Conversation {
								participants {
									seenLastMessage
									user {
										id
										image
										username
									}
								}
							}
						`,
					});

					if (!participantFrag) return;

					const participants = [...participantFrag.participants];

					const userParticipantIdx = participants.findIndex(
						(p) => p.user.id === sessionUserId,
					);

					if (userParticipantIdx === -1) return;

					const userParticipant = participants[userParticipantIdx];

					participants[userParticipantIdx] = {
						...userParticipant,
						seenLastMessage: true,
					};

					cache.writeFragment({
						id: `Conversation:${conversationId}`,
						fragment: gql`
							fragment participants on Conversation {
								participants
							}
						`,
						data: {
							participants,
						},
					});
				},
			});
		} catch (error) {
			let err = error as any;

			console.log(
				`ConversationWrapper.onViewConversation() - Error: ${err?.message}`,
			);
			toast.error(err?.message);
		}
	};

	return (
		<Box
			display={{
				base: conversationId ? 'none' : 'flex',
				md: 'flex',
			}}
			bg='whiteAlpha.50'
			flexDirection='column'
			gap={4}
			px={3}
			py={6}
			width={{
				base: '100%',
				md: '340px',
			}}
		>
			{loading ? (
				<SkeletonLoader count={3} height='80px' />
			) : (
				<ConversationList
					onViewConversation={onViewConversation}
					conversations={data?.getConversations || []}
					sessionUserId={sessionUserId}
				/>
			)}
		</Box>
	);
};

export default ConversationWrapper;
