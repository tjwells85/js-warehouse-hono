import type { Branch, BranchSchema } from '@shared/types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { updateBranch, createBranch } from '@frontend/lib/api/branch';
import { isFailure } from '@frontend/lib/types';
import { useRouter, Link } from '@tanstack/react-router';

interface Props {
	branch?: Branch;
	onSuccess?: (result: Branch) => void;
}

const BranchForm = ({ branch, onSuccess }: Props) => {
	const router = useRouter();
	const [formData, setFormData] = useState<BranchSchema>({
		brId: branch?.brId || '',
		name: branch?.name || '',
		num: branch?.num || 0,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		if (name === 'brId') {
			if (!/^[1-9]*$/.test(value)) return;
			if (value !== '') {
				setFormData((prev) => ({ ...prev, num: parseInt(value) }));
			}
		}

		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (branch) {
			const res = await updateBranch(branch._id, formData);
			if (isFailure(res)) {
				toast.error('Failed to update branch');
				return;
			}

			toast.success('Branch updated successfully');
			router.invalidate();
			onSuccess?.(res.data);
		} else {
			const res = await createBranch(formData);
			if (isFailure(res)) {
				toast.error('Failed to create branch');
				return;
			}

			toast.success('Branch created successfully');
			router.invalidate();
			onSuccess?.(res.data);
		}

		setIsSubmitting(false);
	};

	return (
		<form onSubmit={handleSubmit} className="w-1/4 mx-auto paper my-10">
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Branch ID *</legend>
				<input
					type="text"
					name="brId"
					value={formData.brId}
					onChange={handleChange}
					className="input input-bordered w-full"
					placeholder="Enter branch ID (numbers only)"
					required
					disabled={isSubmitting}
				/>
				<div className="fieldset-label">Numbers only. This will also set the branch number automatically.</div>
			</fieldset>

			<fieldset className="fieldset">
				<legend className="fieldset-legend">Branch Name *</legend>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					className="input input-bordered w-full"
					placeholder="Enter branch name"
					required
					disabled={isSubmitting}
				/>
			</fieldset>

			<div className="flex justify-end gap-2 mt-2">
				{branch && (
					<Link to="/admin/branches" className="btn btn-secondary">
						Go Back
					</Link>
				)}
				<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
					{isSubmitting ? (
						<>
							<span className="loading loading-spinner loading-sm"></span>
							{branch ? 'Updating...' : 'Creating...'}
						</>
					) : branch ? (
						'Update Branch'
					) : (
						'Create Branch'
					)}
				</button>
			</div>
		</form>
	);
};

export default BranchForm;
