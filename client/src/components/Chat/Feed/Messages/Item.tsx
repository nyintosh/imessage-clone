import { _MessagePopulated } from '@/utils/types';
import { Avatar, Box, Flex, Stack, Text } from '@chakra-ui/react';
import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';

type MessageItemProps = {
	message: _MessagePopulated;
	sendByMe: boolean;
};

const formatRelativeLocale = {
	lastWeek: "eeee 'at' p",
	yesterday: "'Yesterday",
	today: 'p',
	other: 'MM/dd/yy',
};

const MessageItem: React.FC<MessageItemProps> = ({ message, sendByMe }) => {
	return (
		<Stack
			direction='row'
			justify={sendByMe ? 'flex-end' : 'flex-start'}
			p={4}
			spacing={4}
			_hover={{ bg: 'whiteAlpha.200' }}
		>
			{!sendByMe ? <Avatar src={message.sender.image} size='sm' /> : null}

			<Stack spacing={1} width='100%'>
				<Stack
					align='center'
					direction='row'
					justify={sendByMe ? 'flex-end' : 'flex-start'}
				>
					{!sendByMe ? (
						<Text fontWeight={500} textAlign='left'>
							{message.sender.username}
						</Text>
					) : null}

					<Text fontSize={14} color='whiteAlpha.700'>
						{formatRelative(message.createdAt, new Date(), {
							locale: {
								...enUS,
								formatRelative: (token) =>
									formatRelativeLocale[
										token as keyof typeof formatRelativeLocale
									],
							},
						})}
					</Text>
				</Stack>

				<Flex justify={sendByMe ? 'flex-end' : 'flex-start'}>
					<Box
						bg={sendByMe ? 'brand.100' : 'whiteAlpha.300'}
						borderRadius={12}
						maxWidth='65%'
						px={2}
						py={1}
					>
						<Text>{message.body}</Text>
					</Box>
				</Flex>
			</Stack>
		</Stack>
	);
};

export default MessageItem;
