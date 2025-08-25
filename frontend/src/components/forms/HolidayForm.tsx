import type { Holiday, HolidaySchema } from '@shared/types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { updateHoliday, addHoliday } from '@frontend/lib/api/holiday';
import { isFailure } from '@frontend/lib/types';
import { useRouter, Link } from '@tanstack/react-router';
import DatePicker from 'react-datepicker';

interface Props {
	holiday?: Holiday;
	onSuccess?: (result: Holiday) => void;
}

// Helper function to detect if a holiday is all-day
const isAllDay = (start: Date, end: Date): boolean => {
	const startHours = start.getHours();
	const startMinutes = start.getMinutes();
	const endHours = end.getHours();
	const endMinutes = end.getMinutes();

	return startHours === 0 && startMinutes === 0 && endHours === 23 && endMinutes >= 59;
};

// Helper to set time to start of day (00:00:00)
const setToStartOfDay = (date: Date): Date => {
	const newDate = new Date(date);
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};

// Helper to set time to end of day (23:59:00)
const setToEndOfDay = (date: Date): Date => {
	const newDate = new Date(date);
	newDate.setHours(23, 59, 0, 0);
	return newDate;
};

const HolidayForm = ({ holiday, onSuccess }: Props) => {
	const router = useRouter();

	const [formData, setFormData] = useState<{
		name: string;
		start: Date;
		end: Date;
		allDay: boolean;
	}>({
		name: holiday?.name || '',
		start: holiday?.start || new Date(),
		end:
			holiday?.end ||
			(() => {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				return tomorrow;
			})(),
		allDay: holiday ? isAllDay(holiday.start, holiday.end) : true,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({ ...prev, name: e.target.value }));
	};

	const handleAllDayToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const allDay = e.target.checked;

		setFormData((prev) => ({
			...prev,
			allDay,
			start: allDay ? setToStartOfDay(prev.start) : prev.start,
			end: allDay ? setToEndOfDay(prev.end) : prev.end,
		}));
	};

	const handleStartDateChange = (date: Date | null) => {
		if (!date) return;

		const newStart = formData.allDay ? setToStartOfDay(date) : date;
		setFormData((prev) => ({
			...prev,
			start: newStart,
			// If start date changes and end is before new start, adjust end
			end: prev.end < newStart ? (formData.allDay ? setToEndOfDay(date) : date) : prev.end,
		}));
	};

	const handleEndDateChange = (date: Date | null) => {
		if (!date) return;

		const newEnd = formData.allDay ? setToEndOfDay(date) : date;
		setFormData((prev) => ({
			...prev,
			end: newEnd,
		}));
	};

	const validateDates = (): string | null => {
		if (formData.start >= formData.end) {
			return 'End date and time must be after start date and time';
		}
		return null;
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const dateError = validateDates();
		if (dateError) {
			toast.error(dateError);
			return;
		}

		setIsSubmitting(true);

		const submitData: HolidaySchema = {
			name: formData.name,
			start: formData.start,
			end: formData.end,
		};

		if (holiday) {
			const res = await updateHoliday(holiday._id, submitData);
			if (isFailure(res)) {
				toast.error('Failed to update holiday');
				setIsSubmitting(false);
				return;
			}

			toast.success('Holiday updated successfully');
			router.invalidate();
			onSuccess?.(res.data);
		} else {
			const res = await addHoliday(submitData);
			if (isFailure(res)) {
				toast.error('Failed to create holiday');
				setIsSubmitting(false);
				return;
			}

			toast.success('Holiday created successfully');
			router.invalidate();
			onSuccess?.(res.data);
		}

		setIsSubmitting(false);
	};

	return (
		<form onSubmit={handleSubmit} className="w-1/4 mx-auto paper my-10">
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Holiday Name *</legend>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleNameChange}
					className="input input-bordered w-full"
					placeholder="Enter holiday name"
					required
					disabled={isSubmitting}
				/>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">All Day Holiday</legend>
				<label className="cursor-pointer label">
					<span className="label-text">This is an all-day holiday</span>
					<input type="checkbox" checked={formData.allDay} onChange={handleAllDayToggle} className="checkbox checkbox-primary" disabled={isSubmitting} />
				</label>
			</fieldset>

			<div className="flex gap-5 w-full">
				<fieldset className="fieldset flex-1">
					<legend className="fieldset-legend">Start Date {!formData.allDay && 'and Time'} *</legend>
					<DatePicker
						selected={formData.start}
						onChange={handleStartDateChange}
						showTimeSelect={!formData.allDay}
						timeIntervals={30}
						timeFormat="HH:mm"
						dateFormat={formData.allDay ? 'MM/dd/yyyy' : 'MM/dd/yyyy HH:mm'}
						className="input input-bordered w-full"
						disabled={isSubmitting}
						placeholderText="Select start date"
					/>
				</fieldset>

				<fieldset className="fieldset flex-1">
					<legend className="fieldset-legend">End Date {!formData.allDay && 'and Time'} *</legend>
					<DatePicker
						selected={formData.end}
						onChange={handleEndDateChange}
						showTimeSelect={!formData.allDay}
						timeIntervals={30}
						timeFormat="HH:mm"
						dateFormat={formData.allDay ? 'MM/dd/yyyy' : 'MM/dd/yyyy HH:mm'}
						className="input input-bordered w-full"
						disabled={isSubmitting}
						placeholderText="Select end date"
						minDate={formData.start}
					/>
				</fieldset>
			</div>
			<div className="flex justify-end gap-2 mt-2">
				{holiday && (
					<Link to="/admin/holidays" className="btn btn-secondary">
						Go Back
					</Link>
				)}
				<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<span className="loading loading-spinner loading-sm"></span>
							{holiday ? 'Updating...' : 'Creating...'}
						</>
					) : holiday ? (
						'Update Holiday'
					) : (
						'Create Holiday'
					)}
				</button>
			</div>
		</form>
	);
};

export default HolidayForm;
