import SkeletonLoader from '@/components/common/SkeletonLoader';
import MessageOperations from '@/graphql/operations/message';
import {
	GetMessagesArgs,
	GetMessagesData,
	MessageSentSubscriptionData,
} from '@/utils/types';
import { useQuery } from '@apollo/client';
import { Flex, Stack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import MessageItem from './Item';

type MessagesProps = {
	conversationId: string;
	userId: string;
};

const Messages: React.FC<MessagesProps> = ({ conversationId, userId }) => {
	const {
		subscribeToMore,
		data: messages,
		error,
		loading,
	} = useQuery<GetMessagesData, GetMessagesArgs>(
		MessageOperations.Query.getMessages,
		{
			onError: ({ message }) => toast.error(message),
			variables: { conversationId },
		},
	);

	const subscribeToNewMessages = (conversationId: string) => {
		subscribeToMore({
			document: MessageOperations.Subscription.messageSent,
			variables: { conversationId },
			updateQuery: (
				prev,
				{ subscriptionData }: MessageSentSubscriptionData,
			) => {
				if (!subscriptionData?.data) return prev;

				const newMessage = subscriptionData.data.messageSent;

				return {
					...prev,
					getMessages:
						newMessage.sender.id !== userId
							? [newMessage, ...prev.getMessages]
							: prev.getMessages,
				};
			},
		});
	};

	useEffect(() => {
		subscribeToNewMessages(conversationId);
	}, [conversationId]);

	if (error) return null;

	return (
		<Flex direction='column' flexGrow={1} justify='flex-end' overflow='hidden'>
			{loading ? (
				<Stack spacing={4} pb={4} px={4}>
					<SkeletonLoader count={4} height='60px' />
				</Stack>
			) : null}

			{messages?.getMessages ? (
				<Flex direction='column-reverse' height='100%' overflowY='scroll'>
					{messages.getMessages.map((message) => (
						<MessageItem
							key={message.id}
							message={message}
							sendByMe={message.sender.id === userId}
						/>
					))}
				</Flex>
			) : null}
		</Flex>
	);
};
export default Messages;
