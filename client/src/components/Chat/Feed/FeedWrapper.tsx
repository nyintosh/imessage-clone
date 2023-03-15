import { Flex, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Messages from './Messages';
import MessagesHeader from './Messages/Header';
import MessagesInput from './Messages/Input';

const FeedWrapper: React.FC = () => {
	const { data: session } = useSession();

	const router = useRouter();

	const { conversationId } = router.query;
	const sessionUserId = session!.user!.id;

	return (
		<Flex
			direction='column'
			display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
			width={{ base: '100%', md: 'calc(100% - 340px)' }}
		>
			{conversationId && typeof conversationId === 'string' ? (
				<>
					<MessagesHeader
						conversationId={conversationId}
						sessionUserId={sessionUserId}
					/>

					<Messages
						conversationId={conversationId}
						sessionUserId={sessionUserId}
					/>

					<MessagesInput conversationId={conversationId} session={session!} />
				</>
			) : (
				<Text>No conversation selected.</Text>
			)}
		</Flex>
	);
};

export default FeedWrapper;
