import { Flex, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Messages from './Messages';
import MessagesHeader from './Messages/Header';
import MessagesInput from './Messages/Input';

const FeedWrapper: React.FC = () => {
	const { data: session } = useSession();

	const router = useRouter();

	const userId = session!.user.id;
	const { conversationId } = router.query;

	return (
		<Flex
			direction='column'
			display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
			width={{ base: '100%', md: 'calc(100% - 340px)' }}
		>
			{conversationId && typeof conversationId === 'string' ? (
				<>
					<MessagesHeader conversationId={conversationId} userId={userId} />

					<Messages conversationId={conversationId} userId={userId} />

					<MessagesInput conversationId={conversationId} userId={userId} />
				</>
			) : (
				<Text>No conversation selected.</Text>
			)}
		</Flex>
	);
};

export default FeedWrapper;
