import MessageOperations from '@/graphql/operations/message';
import { SendMessageArgs, SendMEssageData } from '@/utils/types';
import { useMutation } from '@apollo/client';
import { Box, Input } from '@chakra-ui/react';
import ObjectID from 'bson-objectid';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

type MessagesInputProps = {
	conversationId: string;
	userId: string;
};

const MessagesInput: React.FC<MessagesInputProps> = ({
	conversationId,
	userId,
}) => {
	const [sendMessage] = useMutation<SendMEssageData, SendMessageArgs>(
		MessageOperations.Mutation.sendMessage,
	);

	const [body, setBody] = useState('');

	const onSendMessage = async (ev: React.FormEvent) => {
		ev.preventDefault();

		try {
			const newMessage: SendMessageArgs = {
				id: ObjectID().toHexString(),
				conversationId,
				senderId: userId,
				body,
			};

			const { errors } = await sendMessage({
				variables: {
					...newMessage,
				},
				optimisticResponse: {
					sendMessage: true,
				},
				update: (cache) => {
					/**
					 * TODO:
					 * setup cache
					 */
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

		setBody('');
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
