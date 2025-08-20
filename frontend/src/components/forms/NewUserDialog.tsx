import { useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { toast } from 'react-toastify';
import { createUser } from '@frontend/lib/api/user';
import type { UserSchema } from '@shared/types';

interface Props {
	isOpen: boolean;
	onClose: () => void;
}

const NewUserDialog = ({ isOpen, onClose }: Props) => {
	const router = useRouter();
	const [formData, setFormData] = useState<UserSchema>({
		name: '',
		email: '',
		password: '',
		role: 'user',
	});
	const [confirmPassword, setConfirmPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!formData.name.trim()) {
			toast.error('Name is required');
			return;
		}

		if (!formData.email.trim()) {
			toast.error('Email is required');
			return;
		}

		if (!formData.password) {
			toast.error('Password is required');
			return;
		}

		if (formData.password !== confirmPassword) {
			toast.error('Passwords do not match');
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await createUser(formData);

			if (result.status === 201 && result.data) {
				toast.success('User created successfully');
				router.invalidate();
				handleClose();
			} else {
				toast.error('Failed to create user');
			}
		} catch (error) {
			toast.error('An unexpected error occurred');
			console.error('Error creating user:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		setFormData({
			name: '',
			email: '',
			password: '',
			role: 'user',
		});
		setConfirmPassword('');
		setIsSubmitting(false);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="modal modal-open">
			<div className="modal-box">
				<h3 className="font-bold text-lg mb-4">Create New User</h3>

				<form onSubmit={handleSubmit} className="space-y-4">
					<fieldset className="fieldset">
						<legend className="fieldset-legend">Name *</legend>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							className="input input-bordered w-full"
							placeholder="Enter full name"
							required
							disabled={isSubmitting}
						/>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Email *</legend>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							className="input input-bordered w-full"
							placeholder="Enter email address"
							required
							disabled={isSubmitting}
						/>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Role *</legend>
						<div className="flex gap-4">
							<label className="label cursor-pointer gap-2">
								<input type="radio" name="role" value="user" checked={formData.role === 'user'} onChange={handleInputChange} className="radio radio-primary" disabled={isSubmitting} />
								<span className="label-text">User</span>
							</label>
							<label className="label cursor-pointer gap-2">
								<input type="radio" name="role" value="admin" checked={formData.role === 'admin'} onChange={handleInputChange} className="radio radio-primary" disabled={isSubmitting} />
								<span className="label-text">Admin</span>
							</label>
						</div>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Password *</legend>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							className="input input-bordered w-full"
							placeholder="Enter password"
							required
							disabled={isSubmitting}
						/>
					</fieldset>

					<fieldset className="fieldset">
						<legend className="fieldset-legend">Confirm Password *</legend>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="input input-bordered w-full"
							placeholder="Confirm password"
							required
							disabled={isSubmitting}
						/>
					</fieldset>

					<div className="modal-action">
						<button type="button" className="btn btn-ghost" onClick={handleClose} disabled={isSubmitting}>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<span className="loading loading-spinner loading-sm"></span>
									Creating...
								</>
							) : (
								'Create User'
							)}
						</button>
					</div>
				</form>
			</div>
			<div className="modal-backdrop" onClick={handleClose}></div>
		</div>
	);
};

export default NewUserDialog;
