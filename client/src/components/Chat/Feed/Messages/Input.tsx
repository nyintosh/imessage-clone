import MessageOperations from '@/graphql/operations/message';
import {
	GetMessagesArgs,
	GetMessagesData,
	SendMessageArgs,
	SendMessageData,
} from '@/utils/types';
import { useMutation } from '@apollo/client';
import { Box, Input } from '@chakra-ui/react';
import ObjectID from 'bson-objectid';
import { Session } from 'next-auth';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

type MessagesInputProps = {
	conversationId: string;
	session: Session;
};

const MessagesInput: React.FC<MessagesInputProps> = ({
	conversationId,
	session,
}) => {
	const {
		user: { id: userId, image: userImage, username },
	} = session!;

	const [sendMessage] = useMutation<SendMessageData, SendMessageArgs>(
		MessageOperations.Mutation.sendMessage,
	);

	const [body, setBody] = useState('');

	const onSendMessage = async (ev: React.FormEvent) => {
		ev.preventDefault();

		try {
			const newMessage: SendMessageArgs = {
				id: ObjectID().toHexString(),
				conversationId,
				senderId: session.user.id,
				body,
			};

			setBody('');

			const { errors } = await sendMessage({
				variables: {
					...newMessage,
				},
				optimisticResponse: {
					sendMessage: true,
				},
				update: (cache) => {
					const query = MessageOperations.Query.getMessages;

					const prev = cache.readQuery<GetMessagesData>({
						query,
						variables: { conversationId },
					}) as GetMessagesData;

					cache.writeQuery<GetMessagesData, GetMessagesArgs>({
						query,
						variables: { conversationId },
						data: {
							getMessages: [
								{
									id: newMessage.id,
									sender: {
										id: userId,
										image: userImage,
										username,
									},
									body: newMessage.body,
									createdAt: new Date(),
								},
								...prev.getMessages,
							],
						},
					});
				},
			});

			if (errors) {
				throw new Error('Failed to send message');
			}
		} catch (error) {
			let err = error as any;

			console.log(`onSendMessage() - Error: ${err?.message}`);
			toast.error(err?.message);
		}
	};

	return (
		<Box
			borderTop='1px solid'
			borderColor='whiteAlpha.200'
			px={4}
			py={4}
			width='100%'
		>
			<form onSubmit={onSendMessage}>
				<Input
					onChange={(ev) => setBody(ev.target.value)}
					resize='none'
					_focus={{
						border: '1px solid',
						borderColor: 'whiteAlpha.300',
						boxShadow: 'none',
					}}
					_placeholder={{
						fontStyle: 'italic',
					}}
					placeholder='Aa'
					value={body}
				/>
			</form>
		</Box>
	);
};

export default MessagesInput;
