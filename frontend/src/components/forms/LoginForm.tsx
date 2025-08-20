import { signIn, useSession } from '@frontend/lib/auth-client';
import { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
import { useNavigate } from '@tanstack/react-router';

const LoginForm = () => {
	const { data } = useSession();
	const nav = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await signIn.email({ email, password });
	};

	useEffect(() => {
		if (!PublicKeyCredential.isConditionalMediationAvailable || !PublicKeyCredential.isConditionalMediationAvailable()) {
			return;
		}

		void signIn.passkey({ autoFill: true });
	}, []);

	useEffect(() => {
		if (data?.user) {
			nav({ to: '/' });
		}
	}, [data]);

	return (
		<form onSubmit={handleSubmit} className="w-md mx-auto paper flex flex-col">
			<h1 className="text-2xl mb-4">Login</h1>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Email</legend>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email webauthn" className="input w-full" />
			</fieldset>
			<fieldset className="fieldset">
				<legend className="fieldset-legend">Password</legend>
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password webauthn" className="input w-full" />
			</fieldset>
			<div className="flex justify-end mt-4">
				<button type="submit" className="btn btn-primary">
					Login
				</button>
			</div>
		</form>
	);
};

export default LoginForm;
