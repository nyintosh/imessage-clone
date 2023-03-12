import { SearchedUser } from '@/utils/types';
import { Avatar, Flex, Stack, Text } from '@chakra-ui/react';
import { IoMdClose } from 'react-icons/io';

type ParticipantsProps = {
	subParticipant: (id: string) => void;
	participants: SearchedUser[];
};

const Participants: React.FC<ParticipantsProps> = ({
	subParticipant,
	participants,
}) => {
	return (
		<Flex flexWrap='wrap' gap='10px' mt={6}>
			{participants.map(({ id, image, username }) => (
				<Stack
					key={id}
					align='center'
					bg='whiteAlpha.200'
					borderRadius={6}
					direction='row'
					p={2}
				>
					<Avatar src={image} size='xs' />

					<Text fontSize='sm'>{username}</Text>

					<IoMdClose
						onClick={() => subParticipant(id)}
						cursor='pointer'
						size={15}
					/>
				</Stack>
			))}
		</Flex>
	);
};

export default Participants;
