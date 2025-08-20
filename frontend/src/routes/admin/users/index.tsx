import { createFileRoute, Link } from '@tanstack/react-router';
import { getUsers } from '@frontend/lib/api/user';
import { format } from 'date-fns';
import { useState } from 'react';
import NewUserDialog from '@frontend/components/forms/NewUserDialog';

export const Route = createFileRoute('/admin/users/')({
	component: RouteComponent,
	loader: async () => {
		const users = await getUsers();
		console.log(users);
		return { users };
	},
});

function RouteComponent() {
	const { users } = Route.useLoaderData();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase())
			.join('')
			.slice(0, 2);
	};

	const colors: string[] = ['blue', 'green', 'orange', 'red', 'purple'];

	return (
		<main className="relative">
			<h1 className="text-4xl text-center my-10 text-gray-50">Users</h1>
			<button type="button" className="btn btn-secondary absolute top-10 right-1/3" onClick={() => setIsDialogOpen(true)}>
				Add New User
			</button>
			<div className="w-[95%] mx-auto bg-base-300 pb-3 rounded-lg">
				<table className="table table-zebra w-full">
					<thead>
						<tr>
							<th></th>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Banned</th>
							<th>Ban Reason</th>
							<th>Ban Expires</th>
							<th>Created At</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, i) => (
							<tr key={user.id}>
								<td>
									<div className="avatar">
										<div className="w-12 rounded-full">
											{user.image ? (
												<img src={user.image} alt={user.name} />
											) : (
												<div className="avatar avatar-placeholder">
													<div className="text-neutral-content w-12 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}>
														<span className="text-sm font-semibold">{getInitials(user.name)}</span>
													</div>
												</div>
											)}
										</div>
									</div>
								</td>
								<td>
									<Link to="/admin/users/$id" params={{ id: user.id }} className="link link-primary">
										{user.name}
									</Link>
								</td>
								<td>{user.email}</td>
								<td>
									<div className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>{user.role}</div>
								</td>
								<td>
									<div className={`badge ${user.banned ? 'badge-error' : 'badge-success'}`}>{user.banned ? 'Yes' : 'No'}</div>
								</td>
								<td>{user.banReason || '—'}</td>
								<td>{user.banExpires ? format(new Date(user.banExpires), 'MMM do, yyyy') : '—'}</td>
								<td>{format(new Date(user.createdAt), 'MMM do, yyyy')}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<NewUserDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
		</main>
	);
}
