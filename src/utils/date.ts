import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import ptBr from 'dayjs/locale/pt-br';

dayjs.extend(localizedFormat);
dayjs.extend(advancedFormat);
dayjs.extend(isSameOrBefore);
dayjs.locale(ptBr);

export function parseISO(date: string) {
  return dayjs(date);
}

export function formatDate(date: string | Date, format = 'DD MMM YYYY') {
  return dayjs(date).format(format);
}

export function getMonthKey(date: string | Date) {
  const parsed = dayjs(date);
  return `${parsed.year()}-${String(parsed.month() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(date: string | Date) {
  return dayjs(date).format('MMMM YYYY');
}

export function enumerateDays(start: string, end: string) {
  const cursor = dayjs(start);
  const limit = dayjs(end);
  const days: string[] = [];

  while (cursor.isSameOrBefore(limit, 'day')) {
    days.push(cursor.format('YYYY-MM-DD'));
    cursor.add(1, 'day');
  }

  return days;
}

export function getMonthBoundaries(date: string | Date) {
  const parsed = dayjs(date);
  return {
    start: parsed.startOf('month').format('YYYY-MM-DD'),
    end: parsed.endOf('month').format('YYYY-MM-DD'),
  };
}
