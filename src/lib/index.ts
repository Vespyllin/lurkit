export const getTimeAgo = (timestamp: number, short: boolean = false) => {
	if (!timestamp) return `BAD TS: ${timestamp}`;

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
		unit = short ? 's' : 'sec';
		value = differenceInSeconds;
	} else if (differenceInSeconds < hourThreshold) {
		unit = short ? 'm' : 'min';
		value = Math.floor(differenceInSeconds / minuteThreshold);
	} else if (differenceInSeconds < dayThreshold) {
		unit = short ? 'h' : 'hr';
		value = Math.floor(differenceInSeconds / hourThreshold);
	} else if (differenceInSeconds < weekThreshold) {
		unit = short ? 'd' : 'day';
		value = Math.floor(differenceInSeconds / dayThreshold);
	} else {
		const givenMonth = givenDate.getMonth();
		const givenYear = givenDate.getFullYear();

		const today = new Date();
		const todayMonth = today.getMonth();
		const todayYear = today.getFullYear();

		if (todayYear - givenYear > 0) {
			unit = short ? 'y' : 'yr';
			value = todayYear - givenYear;
		} else if (todayMonth - givenMonth > 0) {
			unit = short ? 'm' : 'mnth';
			value = todayMonth - givenMonth;
		} else {
			unit = short ? 'w' : 'week';
			value = Math.floor(differenceInSeconds / weekThreshold);
		}
	}

	return `${value}${value > 1 && !short ? unit + 's' : unit} ago`;
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

	text = text.replaceAll('&nbsp', '');

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
