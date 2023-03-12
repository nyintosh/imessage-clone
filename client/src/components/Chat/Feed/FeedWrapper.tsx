import { Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import MessagesHeader from './Messages/Header';

const FeedWrapper: React.FC = () => {
	const router = useRouter();

	const { conversationId } = router.query;

	return (
		<Flex
			direction='column'
			display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }}
			width={{ base: '100%', md: 'calc(100% - 400px)' }}
		>
			{conversationId ? (
				<Flex
					direction='column'
					flexGrow={1}
					justify='space-between'
					overflow='hidden'
				>
					<MessagesHeader conversationId={conversationId as string} />
				</Flex>
			) : (
				<Text>No conversation selected.</Text>
			)}
		</Flex>
	);
};

export default FeedWrapper;
