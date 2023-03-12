import ConversationOperations from '@/graphql/operations/conversation';
import { formatUsernames } from '@/utils/functions';
import { GetConversationsData } from '@/utils/types';
import { useQuery } from '@apollo/client';
import { Button, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
// import SkeletonLoader from "../../../common/SkeletonLoader";

type MessagesHeaderProps = {
	conversationId: string;
};

const MessagesHeader: React.FC<MessagesHeaderProps> = ({ conversationId }) => {
	const { data: session } = useSession();

	const router = useRouter();

	const { data, loading } = useQuery<GetConversationsData>(
		ConversationOperations.Queries.getConversations,
	);

	const activeUserId = session!.user.id;

	const conversation = data?.getConversations.find(
		({ id }) => id === conversationId,
	);

	return (
		<Stack
			align='center'
			borderBottom='1px solid'
			borderColor='whiteAlpha.200'
			direction='row'
			px={{ base: 4, md: 0 }}
			py={{ base: 3, md: 4 }}
			spacing={6}
		>
			<Button
				onClick={() =>
					router.replace('?conversationId', '/', {
						shallow: true,
					})
				}
				display={{ md: 'none' }}
				size='sm'
			>
				Back
			</Button>

			{/* {loading && <SkeletonLoader count={1} height="30px" width="320px" />} */}

			{!conversation && !loading && <Text>Conversation Not Found</Text>}

			{conversation && (
				<Stack direction='row'>
					<Text color='whiteAlpha.600'>To: </Text>
					<Text fontWeight={600}>
						{formatUsernames(activeUserId, conversation.participants)}
					</Text>
				</Stack>
			)}
		</Stack>
	);
};

export default MessagesHeader;
