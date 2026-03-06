export const getTimeAgo = (timestamp: number, short: boolean = false) => {
	if (!timestamp) return '?';

	const unitDic: { [unit: string]: { short: string; long: string } } = {
		year: { short: 'y', long: 'year' },
		month: { short: 'mon', long: 'month' },
		week: { short: 'w', long: 'week' },
		day: { short: 'd', long: 'day' },
		hour: { short: 'h', long: 'hr' },
		minute: { short: 'm', long: 'min' },
		second: { short: 's', long: 'sec' }
	};

	const given = new Date(timestamp * 1000);
	const now = new Date();

	// Get differences
	let years = now.getFullYear() - given.getFullYear();
	let months = now.getMonth() - given.getMonth();
	let days = now.getDate() - given.getDate();
	let hours = now.getHours() - given.getHours();
	let minutes = now.getMinutes() - given.getMinutes();
	let seconds = now.getSeconds() - given.getSeconds();

	// Compute carryover
	if (seconds < 0) {
		seconds += 60;
		minutes--;
	}
	if (minutes < 0) {
		minutes += 60;
		hours--;
	}
	if (hours < 0) {
		hours += 24;
		days--;
	}
	if (days < 0) {
		days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
		months--;
	}
	if (months < 0) {
		months += 12;
		years--;
	}

	const weeks = Math.floor(days / 7);
	const remainingDays = days % 7;

	let unit: string;
	let value: number;

	// Take coarsest applicable unit
	if (years > 0) {
		unit = 'year';
		value = years;
	} else if (months > 0) {
		unit = 'month';
		value = months;
	} else if (weeks > 0) {
		unit = 'week';
		value = weeks;
	} else if (remainingDays > 0) {
		unit = 'day';
		value = remainingDays;
	} else if (hours > 0) {
		unit = 'hour';
		value = hours;
	} else if (minutes > 0) {
		unit = 'minute';
		value = minutes;
	} else {
		unit = 'second';
		value = seconds;
	}

	const displayUnit = short ? unitDic[unit].short : unitDic[unit].long;
	return (
		(value < 1 && unit === 'second' ? '<1' : value) +
		' ' +
		displayUnit +
		`${value !== 1 && !short ? 's ago' : ' ago'}`
	);
};

export const cleanText = (text: string, nowhitespace: boolean = false) => {
	if (!text) return '';

	text = text.trimStart().trimEnd();
	text = decodeHTMLText(text);

	if (!nowhitespace) return text;

	let preCleanLen = 0;
	while (preCleanLen != text.length) {
		preCleanLen = text.length;
		text = text.replaceAll('\n\n', '\n');
	}

	preCleanLen = 0;
	while (preCleanLen != text.length) {
		preCleanLen = text.length;
		text = text.replaceAll('  ', ' ');
	}

	return text;
};

export const decodeHTMLText = (encodedString: string) => {
	const entityRegex = /&((nbsp|amp|quot|lt|gt|#x200B|#\d+);)+/g;
	const namedConversions: { [namedEntity: string]: string } = {
		'#x200B': '', // Zero width space
		'#39': "'",
		nbsp: ' ',
		amp: '&',
		quot: '"',
		lt: '<',
		gt: '>'
	};
	return encodedString
		.replace(entityRegex, (_match, entity: string) => {
			const convertedString = namedConversions[entity.slice(0, -1)];
			if (convertedString !== undefined) return convertedString;
			return entity;
		})
		.replace(/&#(\d+);/gi, (_match, numStr: string) => String.fromCharCode(parseInt(numStr, 10)));
};

export const isDarkHex = (hex: string) => {
	const rgb = parseInt(hex.slice(1), 16);
	const r = (rgb >> 16) & 0xff;
	const g = (rgb >> 8) & 0xff;
	const b = rgb & 0xff;
	const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
	return brightness < 127.5;
};

export const setSiteScrollable = (to: boolean) => {
	const body = document.querySelector('body');
	if (body) body.style.overflow = to ? 'auto' : 'hidden';
};
