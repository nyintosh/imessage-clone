import ConversationOperation from '@/graphql/operations/conversation';
import UserOperations from '@/graphql/operations/user';
import {
	CreateConversationArgs,
	CreateConversationData,
	SearchedUser,
	SearchUsersArgs,
	SearchUsersData,
} from '@/utils/types';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Stack,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Participants from './Participants';
import UserSearchList from './UserSearchList';

type ConversationModalProps = {
	onClose: () => void;
	isOpen: boolean;
};

const ConversationModal: React.FC<ConversationModalProps> = ({
	onClose,
	isOpen,
}) => {
	const { data: session } = useSession();

	const router = useRouter();

	const [searchUsers, { data: searchedUsers, loading: isSearchingUser }] =
		useLazyQuery<SearchUsersData, SearchUsersArgs>(
			UserOperations.Queries.searchUsers,
		);

	const [createConversation, { loading: isCreatingConversation }] = useMutation<
		CreateConversationData,
		CreateConversationArgs
	>(ConversationOperation.Mutations.createConversation);

	const [participants, setParticipants] = useState<SearchedUser[]>([]);
	const [username, setUsername] = useState('');

	const { id: userId } = session!.user;

	const onSearchUsers = (ev: React.FormEvent) => {
		ev.preventDefault();
		searchUsers({ variables: { username } });
	};

	const addParticipant = (user: SearchedUser) => {
		setParticipants((prev) => [...prev, user]);
		setUsername('');
	};

	const subParticipant = (id: string) => {
		setParticipants((prev) => prev.filter((p) => p.id !== id));
	};

	const onCreateConversation = async () => {
		try {
			const { data } = await createConversation({
				variables: {
					participantIds: [userId, ...participants.map((p) => p.id)],
				},
			});

			if (!data?.createConversation) {
				throw new Error('Failed to create conversation');
			}

			const {
				createConversation: { conversationId },
			} = data;

			router.push({
				query: {
					conversationId,
				},
			});

			setUsername('');
			onClose();
		} catch (error) {
			const err = error as any;

			console.log(`ConversationModal.onCreateConversation() - Error: ${err}`);
			toast.error(err?.message);
		}
	};

	return (
		<>
			<Modal onClose={onClose} isOpen={isOpen}>
				<ModalOverlay />

				<ModalContent bg='#2d2d2d' pb={4}>
					<ModalHeader>Create a Conversation</ModalHeader>
					<ModalCloseButton />

					<ModalBody>
						<form onSubmit={onSearchUsers}>
							<Stack spacing={4}>
								<Input
									onChange={(e) => setUsername(e.target.value)}
									_placeholder={{ fontStyle: 'italic' }}
									placeholder='Enter username to search...'
									value={username}
								/>

								<Button
									isDisabled={!username}
									isLoading={isSearchingUser}
									type='submit'
								>
									Search
								</Button>
							</Stack>
						</form>

						{searchedUsers?.searchUsers ? (
							<UserSearchList
								addParticipant={addParticipant}
								participants={participants}
								users={searchedUsers.searchUsers}
							/>
						) : null}

						{participants.length > 0 ? (
							<>
								<Participants
									subParticipant={subParticipant}
									participants={participants}
								/>

								<Button
									onClick={onCreateConversation}
									isLoading={isCreatingConversation}
									bg='brand.100'
									mt={6}
									width='100%'
									_hover={{ bg: 'brand.100' }}
								>
									Create Conversation
								</Button>
							</>
						) : null}
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ConversationModal;
