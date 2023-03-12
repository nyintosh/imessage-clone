import { SearchedUser } from '@/utils/types';
import { Avatar, Button, Flex, Stack, Text } from '@chakra-ui/react';

type UserSearchListProps = {
	addParticipant: (user: SearchedUser) => void;
	participants: SearchedUser[];
	users: SearchedUser[];
};

const UserSearchList: React.FC<UserSearchListProps> = ({
	addParticipant,
	participants,
	users,
}) => {
	return (
		<>
			{users.length === 0 ? (
				<Flex mt={6} justify='center'>
					<Text color='whiteAlpha.700' fontStyle='italic'>
						No user found..
					</Text>
				</Flex>
			) : (
				<Stack mt={6}>
					{users.map((user) => (
						<Stack
							key={user.id}
							align='center'
							borderRadius={4}
							direction='row'
							px={4}
							py={2}
							spacing={4}
							_hover={{ bg: 'whiteAlpha.200' }}
						>
							<Avatar src={user.image} />

							<Flex align='center' justify='space-between' width='100%'>
								<Text color='whiteAlpha.700'>{user.username}</Text>

								<Button
									onClick={() => addParticipant(user)}
									isDisabled={!!participants.find(({ id }) => id === user.id)}
									bg='brand.100'
									_hover={{ bg: 'brand.100' }}
								>
									Select
								</Button>
							</Flex>
						</Stack>
					))}
				</Stack>
			)}
		</>
	);
};

export default UserSearchList;
