import { _ConversationPopulated } from '@/utils/types';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ConversationItem from './ConversationItem';
import ConversationModal from './Modal';

type ConversationListProps = {
	onViewConversation: (conversationId: string) => void;
	conversations: _ConversationPopulated[];
};

const ConversationList: React.FC<ConversationListProps> = ({
	onViewConversation,
	conversations,
}) => {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);

	const setOpen = () => setIsOpen(!0);
	const onClose = () => setIsOpen(!1);

	return (
		<Box width='100%'>
			<Box
				bg='blackAlpha.300'
				borderRadius={8}
				cursor='pointer'
				mb={4}
				mx={4}
				px={4}
				py={2}
			>
				<Text
					onClick={setOpen}
					color='whiteAlpha.800'
					fontWeight={500}
					textAlign='center'
				>
					Find or start a conversation
				</Text>
			</Box>

			<ConversationModal onClose={onClose} isOpen={isOpen} />

			<Stack gap={1}>
				{conversations.map((conversation) => (
					<ConversationItem
						key={conversation.id}
						onClick={() => onViewConversation(conversation.id)}
						conversation={conversation}
						isSelected={conversation.id === router.query.conversationId}
					/>
				))}
			</Stack>
		</Box>
	);
};

export default ConversationList;
