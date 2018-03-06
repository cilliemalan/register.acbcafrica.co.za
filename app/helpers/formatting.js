import moment from 'moment';

export const formatSingleDate = (date) => {
    const dateOnly = date.getHours() == 0 &&
        date.getMinutes() == 0 &&
        date.getSeconds() == 0 &&
        date.getMilliseconds() == 0;

    return dateOnly ? moment(date).format('dddd D MMMM')
        : moment(date).format('ddd D MMM HH:mm');
};
export const formatDate = (from, to) => {
    return to ? `${formatSingleDate(from)} — ${formatSingleDate(to)}`
        : `${formatSingleDate(from)}`;
};
export const formatCost = (a) => {
    if (typeof a == 'number') {
        if (a == 0) {
            return 'Free';
        } else {
            return a.toLocaleString('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
            });
        }
    } else {
        return '';
    }
}