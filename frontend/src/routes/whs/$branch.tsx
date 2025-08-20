import { createFileRoute, notFound } from '@tanstack/react-router';
import { type Task, TaskQuerySchema } from '@shared/types';
import { getTasksForBranch } from '@frontend/lib/api/task';
import { getBranchById } from '@frontend/lib/api/branch';
import { isFailure, isSuccess } from '@frontend/lib/types';
import { useEffect, useState } from 'react';
import { getPickPageTitle } from '@frontend/lib/utils';
import { toast } from 'react-toastify';
import PickCount from '@frontend/components/PickCount';
import { getColor, printActive } from '@frontend/lib/utils';
import { formatDistance } from 'date-fns';

const INTERVAL = 1000 * 60; // 1 minute

export const Route = createFileRoute('/whs/$branch')({
	component: RouteComponent,
	validateSearch: (params) => {
		const res = TaskQuerySchema.safeParse(params);
		if (!res.success) return { type: undefined };
		return res.data;
	},
	loaderDeps: ({ search: { type } }) => ({ type }),
	loader: async ({ params, deps }) => {
		const [branchRes, tasksRes] = await Promise.all([getBranchById(params.branch), getTasksForBranch(params.branch, deps.type)]);

		// Handle branchRes errors
		if (isFailure(branchRes)) {
			if (branchRes.status === 404) {
				throw notFound();
			}
			throw new Error(JSON.stringify(branchRes), { cause: branchRes.error });
		}

		// Handle tasksRes errors
		if (isFailure(tasksRes)) {
			if (tasksRes.status === 404) {
				throw notFound();
			}
			throw new Error(JSON.stringify(tasksRes), { cause: tasksRes.error });
		}

		return { branch: branchRes.data, tasks: tasksRes.data, type: deps.type };
	},
});

function RouteComponent() {
	const { branch, tasks, type } = Route.useLoaderData();
	const [pickQueue, setPickQueue] = useState<Task[]>(tasks);

	useEffect(() => {
		const fetchTasks = async () => {
			const res = await getTasksForBranch(branch.brId, type);
			if (isSuccess(res)) {
				setPickQueue(res.data);
			}
		};

		const fetchWithToast = () => {
			toast.dismiss('queue-refresh-toast-display');
			toast.promise(
				fetchTasks,
				{
					pending: 'Updating picking queue...',
					success: 'Picking queue updated!',
					error: 'Failed to update picking queue',
				},
				{ toastId: 'queue-refresh-toast-display' }
			);
		};

		const interval = setInterval(fetchWithToast, INTERVAL);
		console.log(pickQueue);

		return () => clearInterval(interval);
	}, [branch, type]);

	if (!pickQueue.length) {
		return (
			<main className="relative">
				<h1 className="my-10 text-center text-4xl text-gray-50">{getPickPageTitle(branch, type)}</h1>
				<div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
					<div className="bg-success text-white font-bold text-7xl text-center p-5 rounded-xl shadow-2xl">Picking Queue is Clean!</div>
				</div>
			</main>
		);
	}

	return (
		<main>
			<h1 className="my-10 text-center text-4xl text-gray-50">{getPickPageTitle(branch, type)}</h1>
			<PickCount count={pickQueue.length} />
			<table className="mx-auto w-[85%] border-separate border-spacing-y-3">
				<thead>
					<tr className="bg-white text-left text-black">
						<th className="rounded-bl-xl rounded-tl-xl py-5 pl-5"></th>
						<th className="text-3xl">Order #</th>
						<th className="text-3xl">Customer</th>
						<th className="text-3xl">Ship Via</th>
						<th className="rounded-br-xl rounded-tr-xl">
							<span className="text-3xl">Time in Queue</span>&nbsp;(Business Hours)
						</th>
					</tr>
				</thead>
				<tbody>
					{pickQueue.map((pick, i) => (
						<tr key={pick._id} className={getColor(i)}>
							<td className="rounded-bl-xl rounded-tl-xl py-3 pl-5 text-3xl font-medium">
								<div>{i + 1}</div>
							</td>
							<td className="text-3xl font-medium">
								<div>{`${pick.orderId}.${pick.invoiceId}`}</div>
							</td>
							<td className="text-3xl font-medium">
								<div>{pick.shipToName}</div>
							</td>
							<td className="text-3xl font-medium">
								<div>{pick.shipVia}</div>
							</td>
							<td className="rounded-br-xl rounded-tr-xl text-3xl font-medium">
								<div>
									{formatDistance(pick.lastSeen, pick.createdAt)}&nbsp;({printActive(pick.activeTime)})
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</main>
	);
}
