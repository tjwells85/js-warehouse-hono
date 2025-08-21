import { createFileRoute, Link } from '@tanstack/react-router';
import { getAllBranches } from '@frontend/lib/api/branch';
import Title from '@frontend/components/Title';
import { isFailure } from '@frontend/lib/types';

export const Route = createFileRoute('/admin/branches/')({
	component: RouteComponent,
	loader: async () => {
		const res = await getAllBranches();
		if (isFailure(res)) {
			throw new Error(JSON.stringify(res), { cause: res.error });
		}
		return { branches: res.data };
	},
});

function RouteComponent() {
	const { branches } = Route.useLoaderData();

	return (
		<main>
			<Title>Branches</Title>
			<table className="table table-zebra mx-auto w-[15%] rounded-lg bg-base-300 shadow-xl">
				<thead>
					<tr>
						<th>ID</th>
						<th>Store #</th>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					{branches.map((br) => (
						<tr key={br._id}>
							<td>{br.brId}</td>
							<td>{br.num}</td>
							<td>
								<Link to="/admin/branches/$id" params={{ id: br.brId }} className="link font-semibold text-blue-500">
									{br.name}
								</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
