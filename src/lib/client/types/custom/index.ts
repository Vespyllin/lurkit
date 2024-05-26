type ResultWrapper<T> =
	| { status: 'OK'; data: T }
	| { status: 'FAIL' | 'INTERNAL'; reason: string | undefined };
