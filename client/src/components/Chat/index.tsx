import { Flex } from '@chakra-ui/react';
import ConversationWrapper from './Conversations/ConversationWrapper';
import FeedWrapper from './Feed/FeedWrapper';

const Chat: React.FC = () => {
	return (
		<Flex height='100vh'>
			<ConversationWrapper />
			<FeedWrapper />
		</Flex>
	);
};

export default Chat;
