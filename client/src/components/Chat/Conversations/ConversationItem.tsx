import { formatUsernames } from '@/utils/functions';
import { _ConversationPopulated } from '@/utils/types';
import {
	Avatar,
	Box,
	Flex,
	Menu,
	MenuItem,
	MenuList,
	Stack,
	Text,
} from '@chakra-ui/react';
import { formatRelative } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import React, { useState } from 'react';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { GoPrimitiveDot } from 'react-icons/go';
import { MdDeleteOutline } from 'react-icons/md';

const formatRelativeLocale = {
	lastWeek: 'eeee',
	yesterday: "'Yesterday",
	today: 'p',
	other: 'MM/dd/yy',
};

interface ConversationItemProps {
	onClick: () => void;
	// onDeleteConversation: (conversationId: string) => void;
	// onEditConversation?: () => void;
	// onLeaveConversation?: (conversation: ConversationPopulated) => void;
	conversation: _ConversationPopulated;
	isSelected: boolean;
	seenLastMessage: boolean | undefined;
	// selectedConversationId?: string;
	sessionUserId: string;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
	onClick,
	// onDeleteConversation,
	// onEditConversation,
	// onLeaveConversation,
	conversation,
	isSelected,
	seenLastMessage,
	// selectedConversationId,
	sessionUserId,
}) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const handleClick = (ev: React.MouseEvent) => {
		switch (ev.type) {
			case 'click':
				onClick();
				break;
			case 'contextmenu':
				ev.preventDefault();
				setMenuOpen(true);
				break;
			default:
				break;
		}
	};

	return (
		<Stack
			onClick={handleClick}
			onContextMenu={handleClick}
			align='center'
			bg={isSelected ? 'whiteAlpha.200' : 'none'}
			borderRadius={4}
			cursor='pointer'
			direction='row'
			justify='space-between'
			p={4}
			position='relative'
			_hover={{ bg: 'whiteAlpha.200' }}
		>
			<Menu onClose={() => setMenuOpen(false)} isOpen={menuOpen}>
				<MenuList bg='#2d2d2d'>
					<MenuItem
						icon={<AiOutlineEdit fontSize={20} />}
						onClick={(event) => {
							event.stopPropagation();
							//   onEditConversation();
						}}
						bg='#2d2d2d'
						_hover={{ bg: 'whiteAlpha.300' }}
					>
						Edit
					</MenuItem>

					{conversation.participants.length > 2 ? (
						<MenuItem
							icon={<BiLogOut fontSize={20} />}
							onClick={(event) => {
								event.stopPropagation();
								// onLeaveConversation(conversation);
							}}
							bg='#2d2d2d'
							_hover={{ bg: 'whiteAlpha.300' }}
						>
							Leave
						</MenuItem>
					) : null}

					<MenuItem
						icon={<MdDeleteOutline fontSize={20} />}
						onClick={(event) => {
							event.stopPropagation();
							// onDeleteConversation(conversation.id);
						}}
						bg='#2d2d2d'
						_hover={{ bg: 'whiteAlpha.300' }}
					>
						Delete
					</MenuItem>
				</MenuList>
			</Menu>

			{!seenLastMessage && (
				<Flex position='absolute' left='-4px'>
					{true && <GoPrimitiveDot fontSize={18} color='#3D84F7' />}
				</Flex>
			)}

			<Flex align='center' gap={2} overflow='hidden' width='100%'>
				<Avatar size='md' />

				<Flex
					direction='column'
					justify='center'
					width='calc(100% - 3rem - 5rem)'
				>
					<Text
						fontWeight={600}
						textOverflow='ellipsis'
						whiteSpace='nowrap'
						overflow='hidden'
					>
						{formatUsernames(conversation.participants, sessionUserId)}
					</Text>

					{conversation.lastMessage && (
						<Box width='calc(100% + 5rem)'>
							<Text
								color='whiteAlpha.600'
								fontSize='sm'
								whiteSpace='nowrap'
								textOverflow='ellipsis'
								overflow='hidden'
							>
								{conversation.lastMessage.body}
							</Text>
						</Box>
					)}
				</Flex>

				<Text
					alignSelf={conversation.lastMessage ? 'start' : 'center'}
					color='whiteAlpha.600'
					fontSize='sm'
					ml='auto'
					mt={1}
				>
					{formatRelative(new Date(conversation.updatedAt), new Date(), {
						locale: {
							...enUS,
							formatRelative: (token) =>
								formatRelativeLocale[
									token as keyof typeof formatRelativeLocale
								],
						},
					})}
				</Text>
			</Flex>
		</Stack>
	);
};

export default ConversationItem;
