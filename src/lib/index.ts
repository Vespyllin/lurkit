export const getTimeAgo = (timestamp: number) => {
	const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { style: 'long' });

	if (!timestamp) return `fuck`;
	const timestampDate = new Date(timestamp * 1000);
	const nowDate = new Date();

	const timestampSeconds = timestampDate.getSeconds();
	const timestampMinutes = timestampDate.getMinutes();
	const timestampHours = timestampDate.getHours();
	const timestampDays = timestampDate.getDate();
	const timestampMonths = timestampDate.getMonth();
	const timestampYears = timestampDate.getFullYear();

	const nowSeconds = nowDate.getSeconds();
	const nowMinutes = nowDate.getMinutes();
	const nowHours = nowDate.getHours();
	const nowDays = nowDate.getDate();
	const nowMonths = nowDate.getMonth();
	const nowYears = nowDate.getFullYear();

	let unit: Intl.RelativeTimeFormatUnit;
	let value;

	if (nowYears - timestampYears > 0) {
		unit = 'year';
		value = nowYears - timestampYears;
	} else if (nowMonths - timestampMonths > 0) {
		unit = 'month';
		value = nowMonths - timestampMonths;
	} else if (nowDays - timestampDays >= 7) {
		unit = 'week';
		value = Math.floor((nowDays - timestampDays) / 7);
	} else if (nowDays - timestampDays > 0) {
		unit = 'day';
		value = nowDays - timestampDays;
	} else if (nowHours - timestampHours > 0) {
		unit = 'hour';
		value = nowHours - timestampHours;
	} else if (nowMinutes - timestampMinutes > 0) {
		unit = 'minute';
		value = nowMinutes - timestampMinutes;
	} else {
		unit = 'seconds';
		value = nowSeconds - timestampSeconds;
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
