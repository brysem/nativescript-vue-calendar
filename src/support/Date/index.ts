import { en, Locale, nl } from "./Locales";

class Carbon {
  private date: Date;
  public static locale: string = 'en';

  public constructor(date: Date|string = new Date()) {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    this.date = date;
  }

  public static now() {
    return new this();
  }

  public format(format: string) {
    const parts = format.split('');

    return parts.map(part => {
      switch(part) {
        // Day
        case 'd': // Day of the month, 2 digits with leading zeros
          return `${this.day >= 10 ? this.day : '0'+this.day}`;
        case 'D': // A textual representation of a day, three letters
          return `${this.getLocale().days[this.dayOfWeekIso - 1]}`.substr(0, 3);
        case 'j': // Day of the month without leading zeros
          return `${this.day}`;
        case 'l': // A full textual representation of the day of the week
          return `${this.getLocale().days[this.dayOfWeekIso - 1]}`;
        case 'N': // ISO-8601 numeric representation of the day of the week
          return `${this.dayOfWeekIso}`;
        case 'S': // English ordinal suffix for the day of the month, 2 characters
          return ["st","nd","rd"][((this.day + 90) % 100 - 10) % 10 - 1] || "th";
        case 'w': // Numeric representation of the day of the week
          return `${this.dayOfWeek}`;
        case 'z': // The day of the year (starting from 0)
          return `${this.dayOfYear - 1}`;

        // Week
        case 'W': // ISO-8601 week number of year, weeks starting on Monday
          return `${this.weekOfYear}`;

        // Month
        case 'F': // A full textual representation of a month, such as January or March
          return `${this.getLocale().months[this.month - 1]}`;
        case 'm': // Numeric representation of a month, with leading zeros
          return `${this.month >= 10 ? this.month : '0'+this.month}`;
        case 'M': // A short textual representation of a month, three letters
          return `${this.getLocale().months[this.month - 1]}`.substr(0, 3);
        case 'n': // Numeric representation of a month, without leading zeros
          return `${this.month}`;
        case 't': // Number of days in the given month
          return `${this.daysInMonth}`;

        // Year
        case 'L': // Whether it's a leap year
          return this.isLeapYear() ? '1' : '0';
        case 'o': // ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead.
          return 'NOT IMPLEMENTED';
        case 'Y': // A full numeric representation of a year, 4 digits
          return `${this.year}`;
        case 'y': // A two digit representation of a year
          return `${this.year}`.substr(2, 2);

        // Time
        case 'a': // Lowercase Ante meridiem and Post meridiem: am or pm
          return this.hour <= 12 ? 'am' : 'pm';
        case 'A': // Uppercase Ante meridiem and Post meridiem: AM or PM
          return this.hour <= 12 ? 'AM' : 'PM';
        case 'B': // Swatch Internet time: 000 through 999
          return Math.floor((((this.date.getUTCHours() + 1) % 24) + this.date.getUTCMinutes() / 60 + this.date.getUTCSeconds() / 3600) * 1000 / 24);
        case 'g': // 12-hour format of an hour without leading zeros: 1 through 12
          return Math.abs(this.hour - 12);
        case 'G': // 24-hour format of an hour without leading zeros: 0 through 23
          return this.hour;
        case 'h': // 12-hour format of an hour with leading zeros: 01 through 12
          const hour = Math.abs(this.hour - 12);
          return hour >= 10 ? hour : `0${hour}`;
        case 'H': // 24-hour format of an hour with leading zeros: 00 through 23
          return this.hour >= 10 ? this.hour : `0${this.hour}`;
        case 'i': // Minutes with leading zeros: 00 to 59
          return this.minute >= 10 ? this.minute : `0${this.minute}`;
        case 's': // Seconds with leading zeros: 00 through 59
          return this.second >= 10 ? this.second : `0${this.second}`;

        // Default
        default:
          return part;
      }
    }).join('');
  }

  public get year() {
    return this.date.getFullYear();
  }

  public set year(year: number) {
    this.date.setUTCFullYear(year);
  }

  public get month() {
    return this.date.getMonth() + 1;
  }

  public set month(month: number) {
    this.date.setUTCMonth(month - 1); // JS months start at 0
  }

  public get day() {
    return this.date.getDate();
  }

  public set day(day: number) {
    this.date.setUTCDate(day);
  }

  public get hour() {
    return this.date.getHours();
  }

  public set hour(hour: number) {
    this.date.setUTCHours(hour);
  }

  public get minute() {
    return this.date.getMinutes();
  }

  public set minute(minute: number) {
    this.date.setMinutes(minute);
  }

  public get second() {
    return this.date.getSeconds();
  }

  public set second(second: number) {
    this.date.setSeconds(second);
  }

  public set milliseconds(milliseconds: number) {
    this.date.setMilliseconds(milliseconds);
  }

  /**
   * Returns a number between 0 (sunday) and 6 (saturday)
   */
  public get dayOfWeek() {
    return this.date.getDay();
  }

  /**
   * Returns a number between 1 (monday) and 7 (sunday)
   */
  public get dayOfWeekIso() {
    const dayOfWeek = this.date.getDay();

    if (dayOfWeek === 0) {
      return 7;
    }

    return dayOfWeek;
  }

  public get dayOfYear() {
    const now = this.date;
    const start = new Date(this.date.getFullYear(), 0, 0);
    const diff = ((now as any) - (start as any)) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);

    return day;
  }

  public get weekOfYear() {
    var date = new Date(this.date.getTime());
    date.setHours(0, 0, 0, 0);

    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);

    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);

    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  public get daysInMonth() {
    return new Date(this.year, this.month, 0).getDate();
  }

  public get timestamp() {
    return this.date.valueOf();
  }

  public isLeapYear(): boolean {
    return this.date.getDate() === 29;
  }

  public isToday() {
    const startOfDay = Carbon.now().startOfDay();
    const endOfDay = Carbon.now().endOfDay();

    return this.timestamp >= startOfDay.timestamp && this.timestamp <= endOfDay.timestamp;
  }

  public isCurrentMonth(date?: Carbon) {
    const startOfMonth = date?.startOfMonth() || Carbon.now().startOfMonth();
    const endOfMonth = date?.endOfMonth() || Carbon.now().endOfMonth();

    return this.timestamp >= startOfMonth.timestamp && this.timestamp <= endOfMonth.timestamp;
  }

  public isMonday() {
    return this.isDayOfWeek(DAY.MONDAY);
  }

  public isTuesday() {
    return this.isDayOfWeek(DAY.TUESDAY);
  }

  public isWednesday() {
    return this.isDayOfWeek(DAY.WEDNESDAY);
  }

  public isThursday() {
    return this.isDayOfWeek(DAY.THURSDAY);
  }

  public isFriday() {
    return this.isDayOfWeek(DAY.FRIDAY);
  }

  public isSaturday() {
    return this.isDayOfWeek(DAY.SATURDAY);
  }

  public isSunday() {
    return this.isDayOfWeek(DAY.SUNDAY);
  }

  public isDayOfWeek(dayOfWeek: DAY) {
    return this.dayOfWeekIso === dayOfWeek;
  }


  /**
   * @example 1975-12-25
   */
  public toDateString(): string {
    return this.format('Y-m-d');
  }

  /**
   * @example 1975-12-25 14:15:16
   */
  public toDateTimeString(): string {
    return this.format('Y-m-d H:i:s');
  }

  /**
   * @example 14:15:16
   */
  public toTimeString(): string {
    return this.format('H:i:s');
  }

  public toJSDate(): Date {
    return this.date;
  }

  public static fromJSDate(date: Date) {
    return new this(date);
  }

  public static create(year: number, month: number = 1, day: number = 1, hour: number = 0, minute: number = 0, second: number = 0) {
    return new this(new Date(year, month, day, hour, minute, second));
  }

  public clone() {
    return new Carbon(new Date(this.date));
  }

  public getLocale(locale?: string): Locale {
    if (! locale) {
      locale = Carbon.locale;
    }

    switch(locale) {
      case 'nl':
        return nl;
      case 'en':
      default:
        return en;
    }
  }

  public startOfDay() {
    return this.setTime(0, 0, 0, 0);
  }

  public endOfDay() {
    return this.setTime(23, 59, 59, 999);
  }

  public startOfWeek() {
    const date = new Date(this.date);
    const day = date.getDay()
    const difference = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    const startOfWeek = new Carbon(new Date(date.setDate(difference)));

    return startOfWeek.startOfDay();
  }

  public endOfWeek() {
    const startOfWeek = this.startOfWeek();
    const endOfWeek = startOfWeek.addDays(6);

    return endOfWeek.endOfDay();
  }

  public startOfMonth() {
    const date = new Date(this.date);
    const startOfMonth = new Carbon(new Date(date.setDate(1)));

    return startOfMonth.startOfDay();
  }

  public endOfMonth() {
    const startOfMonth = this.startOfMonth();

    return startOfMonth.addMonth().startOfMonth().subDay().endOfDay();
  }

  public startOfYear() {
    const date = new Date(this.year, 0, 2);

    return new Carbon(date).setDate(this.year, 1, 1).startOfDay();
  }

  public endOfYear() {
    const endOfYear = new Date(new Date().getFullYear(), 11, 32);

    return new Carbon(endOfYear).endOfDay();
  }

  public setTime(hour: number, minute?: number, second?: number, milliseconds?: number) {
    this.hour = hour;
    this.minute = minute !== undefined ? minute : this.minute;
    this.second = second !== undefined ? second : this.second;
    this.milliseconds = milliseconds !== undefined ? milliseconds : this.milliseconds

    return this;
  }

  public setDate(year: number, month?: number, day?: number) {
    this.year = year;
    this.month = month !== undefined ? month : this.month;
    this.day = day !== undefined ? day : this.day;

    return this;
  }

  public addSecond() {
    return this.addSeconds(1);
  }

  public addSeconds(seconds: number) {
    this.date.setSeconds(this.date.getSeconds() + seconds);

    return this;
  }

  public subSecond() {
    return this.addSeconds(-1);
  }

  public subSeconds(seconds: number) {
    return this.addSeconds(-1 * seconds);
  }

  public addMinute() {
    return this.addMinutes(1);
  }

  public addMinutes(minutes: number) {
    this.date.setMinutes(this.date.getMinutes() + minutes);

    return this;
  }

  public subMinute() {
    return this.addMinutes(-1);
  }

  public subMinutes(minutes: number) {
    return this.addMinutes(-1 * minutes);
  }

  public addHour() {
    return this.addHours(1);
  }

  public addHours(hours: number) {
    this.date.setHours(this.date.getHours() + hours);

    return this;
  }

  public subHour() {
    return this.addHours(-1);
  }

  public subHours(hours: number) {
    return this.addHours(-1 * hours);
  }

  public addDay() {
    return this.addDays(1);
  }

  public addDays(days: number) {
    this.date.setDate(this.date.getDate() + days);

    return this;
  }

  public subDay() {
    return this.addDays(-1);
  }

  public subDays(days: number) {
    return this.addDays(-1 * days);
  }

  public addWeek() {
    return this.addWeeks(1);
  }

  public addWeeks(weeks: number) {
    return this.addDays(7 * weeks);
  }

  public subWeek() {
    return this.addWeeks(-1);
  }

  public subWeeks(weeks: number) {
    return this.addWeeks(-1 * weeks);
  }

  public addMonth() {
    return this.addMonths(1);
  }

  public addMonths(months: number) {
    this.date = new Date(this.date.setMonth(this.date.getMonth() + months));

    return this;
  }

  public subMonth() {
    return this.addMonths(-1);
  }

  public subMonths(months: number) {
    return this.addMonths(-1 * months);
  }

  public addYear() {
    return this.addYears(1);
  }

  public addYears(years: number) {
    this.date = new Date(this.date.setFullYear(this.date.getFullYear() + years));

    return this;
  }

  public subYear(years: number) {
    return this.addYears(-1);
  }

  public subYears(years: number) {
    return this.addYears(-1 * years);
  }
}

export default Carbon;

export class Period implements Iterable<Carbon>, Iterator<Carbon> {
  private start: Carbon;
  private end: Carbon;
  private current: Carbon;
  private iteration: number = -1;

  constructor(start: Carbon, end: Carbon) {
    this.start = start;
    this.current = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    return this as Iterator<Carbon>;
  }

  next(...args: [] | [Carbon]): IteratorResult<Carbon, undefined> {
    this.iteration += 1;

    const newDate = this.current.clone().addDay();

    if (newDate.timestamp <= this.end.timestamp) {
      if (this.iteration > 0) {
        this.current = newDate;
      }

      return { done: false, value: this.current };
    }

    return { done: true, value: undefined };
  }

  map<U>(callbackfn: (value: Carbon, index: number, array: Carbon[]) => U, thisArg?: any): U[] {
    return Array.from(this).map(callbackfn);
  }
}

export enum DAY {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}
