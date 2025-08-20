import { createFileRoute } from '@tanstack/react-router';
import LoginForm from '@frontend/components/forms/LoginForm';

export const Route = createFileRoute('/login')({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex justify-center flex-col">
			<LoginForm />
		</main>
	);
}
