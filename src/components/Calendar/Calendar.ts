import Carbon, { Period } from '@/support/Date';
import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import CalendarGridHeader from './CalendarGridHeader.vue';
import CalendarGridDay from './CalendarGridDay.vue';
import { chunk } from '@/support/Arr';
import { SwipeDirection, SwipeGestureEventData } from '@nativescript/core';

@Component<Calendar>({
  components: {
    CalendarGridHeader,
    CalendarGridDay,
  }
})
export default class Calendar extends Vue {
  private now = new Carbon();

  private rows: Carbon[][] = [];

  public mounted() {
    // console.log('DAY START', Carbon.now().startOfDay());
    // console.log('DAY END', Carbon.now().endOfDay());
    // console.log('WEEK START', Carbon.now().startOfWeek());
    // console.log('WEEK END', Carbon.now().endOfWeek());
    // console.log('MONTH START', Carbon.now().startOfMonth());
    // console.log('MONTH END', Carbon.now().endOfMonth());
    // console.log('YEAR START', Carbon.now().startOfYear());
    // console.log('YEAR END', Carbon.now().endOfYear());
    // console.log('LEAP YEAR', Carbon.now().isLeapYear());

    this.periodToMonthGrid();
  }

  public get monthPeriod(): Period {
    return new Period(this.now.startOfMonth(), this.now.endOfMonth());
  }

  public periodToMonthGrid() {
    const startOfPeriod = this.now.startOfMonth();
    const endOfPeriod = this.now.endOfMonth();

    const startOfCalendar = startOfPeriod.clone().subDays(startOfPeriod.dayOfWeekIso - 1);
    const endOfCalendar = endOfPeriod.clone().addDays(7 - endOfPeriod.dayOfWeekIso);

    let current = startOfCalendar;
    const dates = [current];
    while(current.timestamp <= endOfCalendar.timestamp) {
      current = current.clone().addDay();
      dates.push(current);
    }

    this.rows = [];
    this.rows = chunk(dates, 7);

    return dates;
  }

  public onTapDate(date: Carbon) {
    alert(date.toDateString());
  }

  public onSwipe(event: SwipeGestureEventData) {
    if (event.direction === SwipeDirection.left) {
      this.now.addMonth();
      this.periodToMonthGrid();
    }

    if (event.direction === SwipeDirection.right) {
      this.now.subMonth();
      this.periodToMonthGrid();
    }
  }
}
