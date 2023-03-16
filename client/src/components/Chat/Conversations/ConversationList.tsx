import { _ConversationPopulated } from '@/utils/types';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import ConversationItem from './ConversationItem';
import ConversationModal from './Modal';

type ConversationListProps = {
	onViewConversation: (
		conversationId: string,
		seenLastMessage: boolean,
	) => void;
	conversations: _ConversationPopulated[];
	sessionUserId: string;
};

const ConversationList: React.FC<ConversationListProps> = ({
	onViewConversation,
	conversations,
	sessionUserId,
}) => {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState(false);

	const setOpen = () => setIsOpen(!0);
	const onClose = () => setIsOpen(!1);

	const sortedConversations = useMemo(
		() =>
			[...conversations].sort(
				(a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
			),
		[conversations],
	);

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
				{sortedConversations.map((conversation) => {
					const participant = conversation.participants.find(
						// @ts-expect-error
						(p) => p.user.id === sessionUserId,
					);

					return (
						<ConversationItem
							key={conversation.id}
							onClick={() =>
								onViewConversation(conversation.id, participant.seenLastMessage)
							}
							conversation={conversation}
							isSelected={conversation.id === router.query.conversationId}
							seenLastMessage={participant.seenLastMessage}
							sessionUserId={sessionUserId}
						/>
					);
				})}
			</Stack>
		</Box>
	);
};

export default ConversationList;
