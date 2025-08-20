import { createFileRoute, Link } from '@tanstack/react-router';
import { getAllBranches } from '@frontend/lib/api/branch';
import { isFailure } from '@frontend/lib/types';

export const Route = createFileRoute('/whs/')({
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
			<h1 className="text-4xl text-gray-50 text-center my-10">Select Branch/View</h1>
			<div className="mx-auto flex w-fit flex-col gap-5 rounded-lg bg-base-300 p-5 shadow-lg">
				{branches.map((br) => (
					<div key={br._id}>
						<h3 className="text-center text-2xl font-medium">{br.name}</h3>
						<div className="mt-2 flex justify-center gap-10">
							<Link to="/whs/$branch" params={{ branch: br.brId }} className="btn btn-primary btn-sm">
								All Picks
							</Link>
							<Link to="/whs/$branch" params={{ branch: br.brId }} search={{ type: 'standard' }} className="btn btn-accent btn-sm">
								Will Call & Delivery
							</Link>
							<Link to="/whs/$branch" params={{ branch: br.brId }} search={{ type: 'willcall' }} className="btn btn-accent btn-sm">
								Will Call Only
							</Link>
							<Link to="/whs/$branch" params={{ branch: br.brId }} search={{ type: 'nonWillCall' }} className="btn btn-accent btn-sm">
								Transfers/Deliveries/Ship-Outs
							</Link>
							<Link to="/whs/$branch" params={{ branch: br.brId }} search={{ type: 'transfers' }} className="btn btn-accent btn-sm">
								Transfers
							</Link>
							<Link to="/whs/$branch" params={{ branch: br.brId }} search={{ type: 'shipouts' }} className="btn btn-accent btn-sm">
								Ship-Outs
							</Link>
							<Link to="/whs/$branch" params={{ branch: br.brId }} search={{ type: 'deliveries' }} className="btn btn-accent btn-sm">
								Deliveries
							</Link>
						</div>
					</div>
				))}
			</div>
		</main>
	);
}
