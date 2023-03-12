import UserOperation from '@/graphql/operations/user';
import { CreateUsernameData, CreateUsernameInput } from '@/utils/types';
import { useMutation } from '@apollo/client';
import {
	Box,
	Button,
	Center,
	Image,
	Input,
	Stack,
	Text,
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface IAuthProps {
	reloadSession: () => void;
}

const Auth: React.FC<IAuthProps> = ({ reloadSession }) => {
	const { data: session } = useSession();

	const [createUsername, { loading }] = useMutation<
		CreateUsernameData,
		CreateUsernameInput
	>(UserOperation.Mutations.createUsername);

	const [username, setUsername] = useState('');

	const onSubmitHandler = async (ev: React.FormEvent) => {
		ev.preventDefault();

		if (username) {
			try {
				const { data } = await createUsername({
					variables: {
						username,
					},
				});

				if (!data?.createUsername) {
					throw new Error('Unexpected error occurred');
				}

				toast.success('Username successfully created 🚀');

				reloadSession();
			} catch (error) {
				const err = error as any;

				console.log(`Auth.onSubmitHandler() - Error: ${err}`);
				toast.error(err?.message);
			}
		}
	};

	return (
		<Center height='100vh'>
			<Stack align='center' mt={-12}>
				{session ? (
					<form onSubmit={onSubmitHandler}>
						<Stack spacing={4}>
							<Input
								onChange={(e) => setUsername(e.target.value)}
								textAlign='center'
								_placeholder={{ fontStyle: 'italic' }}
								placeholder='Enter your username...'
								value={username}
							/>

							<Button
								isDisabled={!username}
								isLoading={loading}
								width='100%'
								type='submit'
							>
								<span style={{ paddingTop: '6px' }}>↵</span>
							</Button>
						</Stack>
					</form>
				) : (
					<>
						<Box boxSize={20} mb={-2}>
							<Image src='/images/imessage-logo.png' />
						</Box>

						<Text fontFamily='monospace' fontSize='3xl'>
							iMessage Clone
						</Text>

						<Button
							onClick={() => signIn('google')}
							leftIcon={<Image src='/images/google-logo.png' height='18px' />}
						>
							Continue with Google
						</Button>
					</>
				)}
			</Stack>
		</Center>
	);
};

export default Auth;
