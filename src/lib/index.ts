export const getTimeAgo = (timestamp: number, short: boolean = false) => {
	if (!timestamp) return `?`;

	const unitDic: { [unit: string]: { short: string; long: string } } = {
		second: {
			short: 's',
			long: 'sec'
		},
		minute: {
			short: 'm',
			long: 'min'
		},
		hour: {
			short: 'h',
			long: 'hr'
		},
		day: {
			short: 'd',
			long: 'day'
		},
		week: {
			short: 'w',
			long: 'week'
		},
		month: {
			short: 'mon',
			long: 'mon'
		},
		year: {
			short: 'y',
			long: 'yr'
		}
	};

	const givenDate = new Date(timestamp * 1000);
	const difference = Date.now() - givenDate.getTime();
	const differenceInSeconds = Math.floor(difference / 1000);

	const minuteThreshold = 60;
	const hourThreshold = minuteThreshold * 60;
	const dayThreshold = hourThreshold * 24;
	const weekThreshold = dayThreshold * 7;

	let unit;
	let value;

	if (differenceInSeconds < minuteThreshold) {
		unit = 'second';
		value = differenceInSeconds;
	} else if (differenceInSeconds < hourThreshold) {
		unit = 'minute';
		value = Math.floor(differenceInSeconds / minuteThreshold);
	} else if (differenceInSeconds < dayThreshold) {
		unit = 'hour';
		value = Math.floor(differenceInSeconds / hourThreshold);
	} else if (differenceInSeconds < weekThreshold) {
		unit = 'day';
		value = Math.floor(differenceInSeconds / dayThreshold);
	} else {
		const givenMonth = givenDate.getMonth();
		const givenYear = givenDate.getFullYear();

		const today = new Date();
		const todayMonth = today.getMonth();
		const todayYear = today.getFullYear();

		if (todayYear - givenYear > 0) {
			unit = 'year';
			value = todayYear - givenYear;
		} else if (todayMonth - givenMonth > 0) {
			unit = 'month';
			value = todayMonth - givenMonth;
		} else {
			unit = 'week';
			value = Math.floor(differenceInSeconds / weekThreshold);
		}
	}

	const displayUnit = short ? unitDic[unit].short : unitDic[unit].long;

	return (
		(value < 1 && displayUnit == 'second' ? '<1' : value) +
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

const decodeHTMLText = (encodedString: string) => {
	const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
	const translate: any = {
		nbsp: ' ',
		amp: '&',
		quot: '"',
		lt: '<',
		gt: '>'
	};
	return encodedString
		.replace(translate_re, (match, entity: any) => {
			return translate[entity];
		})
		.replace(/&#(\d+);/gi, (match, numStr: any) => {
			var num = parseInt(numStr, 10);
			return String.fromCharCode(num);
		});
};
