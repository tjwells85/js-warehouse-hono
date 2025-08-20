import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
	count: number;
}

const PickCount = ({ count }: Props) => {
	const color = useMemo(() => {
		if (count > 100) return 'bg-red-500';
		if (count > 70) return 'bg-orange-500';
		if (count > 50) return 'bg-yellow-500';
		return 'bg-green-500';
	}, [count]);

	return (
		<div className={twMerge('absolute right-3 top-3 rounded-xl px-5 py-3 shadow-lg', color)}>
			<h2 className="text-4xl font-medium text-white">{count} Items</h2>
		</div>
	);
};

export default PickCount;
