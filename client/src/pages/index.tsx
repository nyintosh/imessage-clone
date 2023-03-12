import Auth from '@/components/Auth';
import Chat from '@/components/Chat';
import { Box } from '@chakra-ui/react';
import { NextPageContext } from 'next';
import { getSession, useSession } from 'next-auth/react';

export default function Home() {
	const { data: session } = useSession();

	const reloadSession = () => {
		const event = new Event('visibilitychange');
		document.dispatchEvent(event);
	};

	return (
		<Box>
			{session?.user.username ? (
				<Chat />
			) : (
				<Auth reloadSession={reloadSession} />
			)}
		</Box>
	);
}

export async function getServerSideProps(ctx: NextPageContext) {
	const session = await getSession(ctx);

	return {
		props: { session },
	};
}
