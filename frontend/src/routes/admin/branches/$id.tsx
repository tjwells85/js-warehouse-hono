import { createFileRoute, notFound } from '@tanstack/react-router';
import { getBranchById } from '@frontend/lib/api/branch';
import Title from '@frontend/components/Title';
import { isFailure } from '@frontend/lib/types';
import BranchForm from '@frontend/components/forms/BranchForm';

export const Route = createFileRoute('/admin/branches/$id')({
	component: RouteComponent,
	loader: async ({ params }) => {
		const res = await getBranchById(params.id);
		if (isFailure(res)) {
			if (res.status === 404) {
				throw notFound();
			}

			throw new Error(JSON.stringify(res), { cause: res.error });
		}

		return { branch: res.data };
	},
});

function RouteComponent() {
	const { branch } = Route.useLoaderData();

	return (
		<main>
			<Title>{branch.name}</Title>
			<BranchForm branch={branch} />
		</main>
	);
}
