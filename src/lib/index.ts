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
