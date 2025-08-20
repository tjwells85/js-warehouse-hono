import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { ToastContainer } from 'react-toastify';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootEl = document.getElementById('root');
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl);
	root.render(
		<React.StrictMode>
			<RouterProvider router={router} />
			<ToastContainer autoClose={5000} position="bottom-right" pauseOnFocusLoss={false} pauseOnHover={false} />
		</React.StrictMode>
	);
}
