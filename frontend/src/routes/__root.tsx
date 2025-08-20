import * as React from 'react';
import { Outlet, createRootRoute, Link, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Icon } from '@iconify/react';
import { getSession, signOut } from '@frontend/lib/auth-client';

export const Route = createRootRoute({
	component: RootComponent,
	beforeLoad: async ({ location }) => {
		const { data } = await getSession();

		if (location.pathname.startsWith('/admin')) {
			if (!data?.user || data.user.role !== 'admin' || data.user.banned) {
				throw redirect({ to: '/', replace: true });
			}
		}
	},
	loader: async () => {
		const { data } = await getSession();

		if (data?.user.banned) {
			return { user: null };
		}

		return { user: data?.user ?? null };
	},
});

function RootComponent() {
	const { user } = Route.useLoaderData();
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [debugInfo, setDebugInfo] = useState<{
		date: Date;
		isActive: boolean;
	} | null>(null);

	// For development debug info
	useEffect(() => {
		if (import.meta.env.DEV) {
			const updateDebugInfo = () => {
				const now = new Date();
				// Simple active time check - you can replace this with your actual isActiveTime logic
				// For now, assuming active during business hours (8 AM - 6 PM)
				const hour = now.getHours();
				const isActive = hour >= 8 && hour < 18;

				setDebugInfo({ date: now, isActive });
			};

			updateDebugInfo();
			const interval = setInterval(updateDebugInfo, 1000);

			return () => clearInterval(interval);
		}
	}, []);

	const printDateTime = (date: Date) => {
		return format(date, 'MMM do yyyy h:mm:ss aaaa');
	};

	const handleLogout = async () => {
		await signOut();
		setIsDrawerOpen(false);
	};

	const toggleDrawer = () => {
		setIsDrawerOpen((curr) => !curr);
	};

	const closeDrawer = () => {
		setIsDrawerOpen(false);
	};

	return (
		<React.Fragment>
			{/* Debug info for development */}
			{import.meta.env.DEV && debugInfo && (
				<div className="relative">
					<div className="absolute left-1/4 flex gap-2 bg-base-300 p-2 z-50">
						<h4>Time: {printDateTime(debugInfo.date)}</h4>
						{debugInfo.isActive ? <span className="text-green-600">Active</span> : <span className="text-red-500">Inactive</span>}
					</div>
				</div>
			)}

			{/* Drawer Layout */}
			<header className="drawer">
				<input id="nav-drawer" type="checkbox" className="drawer-toggle" checked={isDrawerOpen} readOnly />

				<div className="drawer-content">
					<label htmlFor="nav-drawer" className="btn btn-circle btn-accent drawer-button ml-3 mt-3" title="Show Menu" onClick={toggleDrawer}>
						<Icon icon="fontisto:nav-icon-list-a" color="black" />
					</label>

					{/* Main Content */}
					<Outlet />
				</div>

				<nav className="drawer-side">
					<label htmlFor="nav-drawer" aria-label="close sidebar" className="drawer-overlay" onClick={closeDrawer} />

					<div className="flex min-h-full w-80 flex-col gap-3 bg-base-200 p-4 text-base-content">
						<h1 className="text-3xl font-semibold">Warehouse Apps</h1>

						<div className="border-b border-t p-5">
							{user ? (
								<div className="flex items-center justify-between">
									<h3>{user.name}</h3>
									<button type="button" className="btn btn-secondary btn-sm" onClick={handleLogout}>
										Logout
									</button>
								</div>
							) : (
								<Link to="/login" className="btn btn-primary" onClick={closeDrawer}>
									Login
								</Link>
							)}
						</div>

						<ul className="menu w-full text-xl">
							<li>
								<Link to="/" onClick={closeDrawer}>
									Home
								</Link>
							</li>
							<li>
								<Link to="/whs" onClick={closeDrawer}>
									Warehouse In Process
								</Link>
							</li>
						</ul>

						{user && (
							<div className="border-t pt-3">
								<h3 className="text-2xl">Administration</h3>
								<ul className="menu w-full mt-3 text-xl">
									<li>
										<Link to="/admin" onClick={closeDrawer}>
											Admin Home
										</Link>
									</li>
									<li>
										<Link to="/admin/branches" onClick={closeDrawer}>
											Branches
										</Link>
									</li>
									<li>
										<Link to="/admin/holidays" onClick={closeDrawer}>
											Holidays
										</Link>
									</li>
									<li>
										<Link to="/admin/logs" onClick={closeDrawer}>
											Logs
										</Link>
									</li>
									<li>
										<Link to="/admin/reset" onClick={closeDrawer}>
											Reset Data
										</Link>
									</li>
									<li>
										<Link to="/admin/shipvias" onClick={closeDrawer}>
											Ship Vias
										</Link>
									</li>
									<li>
										<Link to="/admin/stats" onClick={closeDrawer}>
											Statistics
										</Link>
									</li>
									<li>
										<Link to="/admin/users" onClick={closeDrawer}>
											Users
										</Link>
									</li>
								</ul>
							</div>
						)}
					</div>
				</nav>
			</header>
		</React.Fragment>
	);
}
