import type { Holiday } from '@shared/types';
import { useState } from 'react';
import { Link, useRouter } from '@tanstack/react-router';
import { deleteHoliday } from '@frontend/lib/api/holiday';
import { isFailure } from '@frontend/lib/types';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface Props {
	holidays: Holiday[];
}

// Helper function to detect if a holiday is all-day
const isAllDay = (start: Date, end: Date): boolean => {
	const startHours = start.getHours();
	const startMinutes = start.getMinutes();
	const endHours = end.getHours();
	const endMinutes = end.getMinutes();

	return startHours === 0 && startMinutes === 0 && endHours === 23 && endMinutes >= 59;
};

// Format date for display
const formatHolidayDate = (date: Date, allDay: boolean): string => {
	if (allDay) {
		return format(date, 'eee, MMM do, yyyy');
	}
	return format(date, 'eee, MMM do, yyyy h:mm a');
};

const HolidaysTable = ({ holidays }: Props) => {
	const router = useRouter();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

	const handleDeleteClick = (holiday: Holiday) => {
		setDeleteDialogId(holiday._id);
		// Show the modal
		const modal = document.getElementById('delete_holiday_modal') as HTMLDialogElement;
		modal?.showModal();
	};

	const handleDeleteConfirm = async () => {
		if (!deleteDialogId) return;

		setDeletingId(deleteDialogId);

		const res = await deleteHoliday(deleteDialogId);
		if (isFailure(res)) {
			toast.error('Failed to delete holiday');
			setDeletingId(null);
			return;
		}

		toast.success('Holiday deleted successfully');
		router.invalidate();
		setDeletingId(null);
		setDeleteDialogId(null);

		// Close the modal
		const modal = document.getElementById('delete_holiday_modal') as HTMLDialogElement;
		modal?.close();
	};

	const handleDeleteCancel = () => {
		setDeleteDialogId(null);
		const modal = document.getElementById('delete_holiday_modal') as HTMLDialogElement;
		modal?.close();
	};

	if (holidays.length === 0) {
		return (
			<div className="alert alert-info w-1/4 mx-auto">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>No holidays are currently scheduled.</span>
			</div>
		);
	}

	const selectedHoliday = holidays.find((h) => h._id === deleteDialogId);

	return (
		<>
			<div className="overflow-x-auto">
				<table className="table table-zebra bg-base-300 p-5 rounded-lg shadow-2xl w-1/3 mx-auto">
					<thead>
						<tr>
							<th>Holiday Name</th>
							<th>Start</th>
							<th>End</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{holidays.map((holiday) => {
							const allDay = isAllDay(holiday.start, holiday.end);

							return (
								<tr key={holiday._id}>
									<td className="font-medium">{holiday.name}</td>
									<td>{formatHolidayDate(holiday.start, allDay)}</td>
									<td>{formatHolidayDate(holiday.end, allDay)}</td>
									<td>
										<div className="flex gap-2">
											<Link to="/admin/holidays/$id" params={{ id: holiday._id }} className="btn btn-sm btn-primary">
												Edit
											</Link>
											<button onClick={() => handleDeleteClick(holiday)} disabled={deletingId === holiday._id} className="btn btn-sm btn-error">
												{deletingId === holiday._id ? (
													<>
														<span className="loading loading-spinner loading-xs"></span>
														Deleting...
													</>
												) : (
													'Delete'
												)}
											</button>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Delete Confirmation Modal */}
			<dialog id="delete_holiday_modal" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Delete Holiday</h3>
					<p className="py-4">Are you sure you want to delete the holiday "{selectedHoliday?.name}"? This action cannot be undone.</p>
					<div className="modal-action">
						<button onClick={handleDeleteCancel} className="btn btn-ghost" disabled={!!deletingId}>
							Cancel
						</button>
						<button onClick={handleDeleteConfirm} className="btn btn-error" disabled={!!deletingId}>
							{deletingId ? (
								<>
									<span className="loading loading-spinner loading-sm"></span>
									Deleting...
								</>
							) : (
								'Delete Holiday'
							)}
						</button>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button onClick={handleDeleteCancel}>close</button>
				</form>
			</dialog>
		</>
	);
};

export default HolidaysTable;
