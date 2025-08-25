import { createFileRoute } from '@tanstack/react-router';
import { getHolidays } from '@frontend/lib/api';
import Title from '@frontend/components/Title';
import HolidayForm from '@frontend/components/forms/HolidayForm';
import HolidaysTable from '@frontend/components/HolidaysTable';
import { isFailure } from '@frontend/lib/types';

export const Route = createFileRoute('/admin/holidays/')({
	component: RouteComponent,
	loader: async () => {
		const data = await getHolidays();
		if (isFailure(data)) {
			throw new Error('Failed to load holidays');
		}

		return { holidays: data.data };
	},
});

function RouteComponent() {
	const { holidays } = Route.useLoaderData();

	return (
		<main>
			<Title>Holidays</Title>
			<HolidayForm />
			<HolidaysTable holidays={holidays} />
		</main>
	);
}
