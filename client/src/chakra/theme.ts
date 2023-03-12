import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
	initialColorMode: 'dark',
};

export const theme = extendTheme(
	{
		config,
	},
	{
		colors: {
			brand: {
				100: '#3D84F7',
			},
		},
		styles: {
			global: () => ({
				body: {
					bg: 'whiteAlpha.200',
				},
			}),
		},
	},
);
