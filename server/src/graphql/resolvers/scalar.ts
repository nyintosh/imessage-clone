import { GraphQLScalarType, Kind } from 'graphql';

const dateScalar = new GraphQLScalarType({
	name: 'Date',
	description: 'Date custom scalar type',
	serialize(value: any) {
		if (!(value instanceof Date)) {
			throw new TypeError(`Value is not an instance of Date: ${value}`);
		}

		return value.getTime();
	},
	parseValue(value: any) {
		const date = new Date(value);

		if (isNaN(date.getTime())) {
			throw new TypeError(`Value is not a valid Date: ${value}`);
		}

		return date;
	},
	parseLiteral(ast) {
		if (ast.kind !== Kind.INT) {
			throw new TypeError(
				`Can only parse integers to dates but got a: ${ast.kind}`,
			);
		}

		const date = new Date(parseInt(ast.value, 10));

		if (isNaN(date.getTime())) {
			throw new TypeError(`Value is not a valid Date: ${ast.value}`);
		}

		return date;
	},
});

const resolvers = {
	Date: dateScalar,
};

export default resolvers;
