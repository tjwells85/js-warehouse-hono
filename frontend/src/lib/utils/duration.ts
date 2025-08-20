import type { Duration } from 'date-fns';
import ms from 'ms';

type Rounding = {
	threshold: number;
	units: 'seconds' | 'minutes' | 'hours';
};

type RoundTuple = [number, number];

const roundUnit = (original: number, max: number, threshold: number): number => {
	if (threshold > max || max % threshold !== 0) {
		throw new RangeError(`Threshold must fit evenly within the max value`);
	}

	if (original > max) {
		throw new RangeError('Original value cannot be greater than max');
	}

	const compare: RoundTuple[] = [];

	for (let i = 0; i < max; i += threshold) {
		compare.push([i, i + threshold]);
	}

	let num = original;

	for (const [a, b] of compare) {
		if (original >= a && original <= b) {
			const left = original - a;
			const right = b - original;

			if (left < right) {
				num = a;
			} else {
				num = b;
			}

			break;
		}
	}

	return num;
};

export const secToDuration = (sec: number, round?: Rounding): Duration => {
	const duration: Duration = {
		years: undefined,
		months: undefined,
		weeks: undefined,
		days: undefined,
		hours: undefined,
		minutes: undefined,
		seconds: undefined,
	};

	let time = sec * 1000;
	const yrMs = ms('1y');
	const monMs = ms('30d');
	const wkMs = ms('1w');
	const dayMs = ms('1d');
	const hrMs = ms('1h');
	const minMs = ms('1m');

	if (time >= yrMs) {
		const years = Math.floor(time / yrMs);
		duration.years = years;
		time -= years * yrMs;
	}

	if (time >= monMs) {
		const months = Math.floor(time / monMs);
		duration.months = months;
		time -= months * monMs;
	}

	if (time >= wkMs) {
		const weeks = Math.floor(time / wkMs);
		duration.weeks = weeks;
		time -= weeks * wkMs;
	}

	if (time >= dayMs) {
		const days = Math.floor(time / dayMs);
		duration.days = days;
		time -= days * dayMs;
	}

	if (time >= hrMs) {
		const hours = Math.floor(time / hrMs);
		duration.hours = hours;
		time -= hours * hrMs;
	}

	if (time >= minMs) {
		const mins = Math.floor(time / minMs);
		duration.minutes = mins;
		time -= mins * minMs;
	}

	if (time >= 0) {
		const seconds = Math.ceil(time / 1000);
		if (round && round.units === 'seconds') {
			const rounded = roundUnit(seconds, 60, round.threshold);

			if (rounded === 60) {
				if (duration.minutes) {
					duration.minutes++;
				} else {
					duration.minutes = 1;
				}
			} else {
				duration.seconds = rounded;
			}
		} else {
			duration.seconds = seconds;
		}
	} else {
		duration.seconds = 0;
	}

	return duration;
};

export const printDuration = (duration: Duration | number, round?: Rounding): string => {
	const d = typeof duration === 'number' ? secToDuration(duration, round) : duration;
	let str = '';

	if (d.years) str += `${d.years}y `;
	if (d.months) str += `${d.months}mo `;
	if (d.weeks) str += `${d.weeks}w `;
	if (d.days) str += `${d.days}d `;
	if (d.hours) str += `${d.hours}h `;
	if (d.minutes) str += `${d.minutes}m`;

	return str;
};

export const printActive = (active: number): string => {
	if (active < 60) {
		return 'now';
	}

	return printDuration(active, { units: 'seconds', threshold: 15 });
};
