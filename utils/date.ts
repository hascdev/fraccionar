
export function getDateFromISOString(date_str: string) {
    const date = new Date(date_str);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date;
}

export function getReadableDateFormat(date_str: string) {
    const date = getDateFromISOString(date_str);
    return date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export function getMonthYearFormat(date: Date) {
    const month = date.toLocaleDateString(undefined, { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
}

export function toISOStringFormatShort(date: Date) {
    //console.log(toISOStringFormat(date));
    return toISOStringFormat(date).substring(0, 10);
}

export function toISOStringFormat(date: Date) {
    const pad = function (num: number) { return (num < 10 ? '0' : '') + num; };
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        '.' + date.getMilliseconds() + 'Z';
}
