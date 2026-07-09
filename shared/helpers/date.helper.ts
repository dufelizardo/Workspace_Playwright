import dayjs from 'dayjs';

export const formatDate = (date: Date, format = 'YYYY-MM-DD'): string => dayjs(date).format(format);

export const today = (format = 'YYYY-MM-DD'): string => dayjs().format(format);
