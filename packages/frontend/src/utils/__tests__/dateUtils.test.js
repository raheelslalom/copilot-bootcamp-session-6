import { isOverdue, formatDate } from '../dateUtils';

describe('isOverdue', () => {
  const PAST_DATE = '2000-01-01';
  const FUTURE_DATE = '2099-12-31';

  // Compute today's date in the same format isOverdue uses for comparison
  const todayString = new Date().toDateString();
  const TODAY_DATE = new Date(todayString).toISOString().split('T')[0];

  describe('returns false', () => {
    it('when dueDate is null', () => {
      expect(isOverdue(null, 0)).toBe(false);
    });

    it('when dueDate is undefined', () => {
      expect(isOverdue(undefined, 0)).toBe(false);
    });

    it('when dueDate is empty string', () => {
      expect(isOverdue('', 0)).toBe(false);
    });

    it('when dueDate is in the future and todo is incomplete', () => {
      expect(isOverdue(FUTURE_DATE, 0)).toBe(false);
    });

    it('when dueDate is today and todo is incomplete (today is NOT overdue)', () => {
      expect(isOverdue(TODAY_DATE, 0)).toBe(false);
    });

    it('when dueDate is in the past but todo is completed (completed=1)', () => {
      expect(isOverdue(PAST_DATE, 1)).toBe(false);
    });

    it('when dueDate is in the past but todo is completed (completed=true)', () => {
      expect(isOverdue(PAST_DATE, true)).toBe(false);
    });
  });

  describe('returns true', () => {
    it('when dueDate is in the past and todo is incomplete (completed=0)', () => {
      expect(isOverdue(PAST_DATE, 0)).toBe(true);
    });

    it('when dueDate is in the past and todo is incomplete (completed=false)', () => {
      expect(isOverdue(PAST_DATE, false)).toBe(true);
    });
  });
});

describe('formatDate', () => {
  it('returns null for null input', () => {
    expect(formatDate(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(formatDate(undefined)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(formatDate('')).toBeNull();
  });

  it('formats a valid ISO date string into a locale date string', () => {
    const result = formatDate('2026-03-26');
    expect(result).toMatch(/March/);
    expect(result).toMatch(/26/);
    expect(result).toMatch(/2026/);
  });

  it('formats another valid date correctly', () => {
    const result = formatDate('2025-12-25');
    expect(result).toMatch(/December/);
    expect(result).toMatch(/25/);
    expect(result).toMatch(/2025/);
  });
});
