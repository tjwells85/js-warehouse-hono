import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/users/$id')({
	component: RouteComponent,
});

function RouteComponent() {
	return <main>Hello "/admin/users/$id"!</main>;
}
