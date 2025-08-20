import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main>
			<h1 className="text-center text-4xl text-white">Welcome to JS Warehouse Apps</h1>
		</main>
	);
}
