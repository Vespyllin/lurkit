export const getTimeAgo = (timestamp: number) => {
	const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { style: 'long' });

	if (!timestamp) return `BAD TS: ${timestamp}`;

	const givenDate = new Date(timestamp * 1000);
	const difference = Date.now() - givenDate.getTime();
	const differenceInSeconds = Math.floor(difference / 1000);

	const minuteThreshold = 60;
	const hourThreshold = minuteThreshold * 60;
	const dayThreshold = hourThreshold * 24;

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
	} else {
		unit = 'day';
		value = Math.floor(differenceInSeconds / dayThreshold);
	}

	return relativeTimeFormatter.format(-value, unit as any);
};

export const cleanText = (text: string, nowhitespace: boolean = false) => {
	if (!text) return '';

	text = text.trimStart().trimEnd();
	text = decodeEntities(text);

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

const decodeEntities = (encodedString: string) => {
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
