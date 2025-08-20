interface ColorSchemes {
	default: string[];
	rainbow: string[];
}

const COLORS: ColorSchemes = {
	default: ['bg-orange-500', 'bg-secondary', 'bg-success', 'bg-info', 'bg-warning'],
	rainbow: ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-info', 'bg-indigo-500', 'bg-purple-500'],
};

const getTaskColorTheme = (): keyof ColorSchemes => {
	const colorMode = import.meta.env.PUBLIC_COLOR_MODE?.toLowerCase();

	switch (colorMode) {
		case 'pride':
			return 'rainbow';
		default:
			return 'default';
	}
};

/**
 * Get color for task background based on index.
 * Set PUBLIC_COLOR_MODE environment variable to 'pride' to use rainbow colors.
 * @param index - The index of the color to retrieve.
 * @returns The color class name.
 */
export const getColor = (index: number) => {
	const key = getTaskColorTheme();

	const array = COLORS[key];

	const i = index % array.length;
	return array[i];
};
