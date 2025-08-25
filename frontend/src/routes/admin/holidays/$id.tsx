import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router';
import { getHoliday } from '@frontend/lib/api/holiday';
import { isFailure } from '@frontend/lib/types';
import Title from '@frontend/components/Title';
import HolidayForm from '@frontend/components/forms/HolidayForm';

export const Route = createFileRoute('/admin/holidays/$id')({
	component: RouteComponent,
	loader: async ({ params }) => {
		const result = await getHoliday(params.id);

		if (isFailure(result)) {
			if (result.status === 404) {
				throw notFound();
			}
			throw new Error(`Failed to load holiday: ${result.error}`);
		}

		return { holiday: result.data };
	},
});

function RouteComponent() {
	const nav = useNavigate();
	const { holiday } = Route.useLoaderData();

	const handleSuccess = () => {
		// Navigate back to holidays list after successful update
		nav({ to: '/admin/holidays' });
	};

	return (
		<main>
			<Title>Edit Holiday</Title>
			<HolidayForm holiday={holiday} onSuccess={handleSuccess} />
		</main>
	);
}
