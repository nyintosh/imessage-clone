import 'next-auth';
import { User } from '../utils/types.js';

declare module 'next-auth' {
	interface Session {
		user: User;
	}
}
