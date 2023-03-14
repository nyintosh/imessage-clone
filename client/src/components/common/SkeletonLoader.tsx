import { Skeleton } from '@chakra-ui/react';

type SkeletonLoaderProps = {
	count: number;
	height: string;
	width?: string;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
	count,
	height,
	width,
}) => {
	return (
		<>
			{[...Array(count).keys()].map((key) => (
				<Skeleton
					key={key}
					startColor='whiteAlpha.50'
					endColor='whiteAlpha.300'
					height={height}
					width={{ base: 'full' }}
					borderRadius={4}
				/>
			))}
		</>
	);
};
export default SkeletonLoader;
