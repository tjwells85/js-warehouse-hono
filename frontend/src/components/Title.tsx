import { twMerge } from 'tailwind-merge';
import type { PropsWithChildren } from 'react';

interface Props {
	className?: string;
}

const Title = ({ className, children }: PropsWithChildren<Props>) => {
	return <h1 className={twMerge('text-4xl text-center text-gray-50 my-10 font-bold', className)}>{children}</h1>;
};

export default Title;
