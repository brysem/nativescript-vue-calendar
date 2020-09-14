<template>
  <StackLayout :class="classes" v-on="$listeners" v-bind="$attrs">
    <Label>{{ dayLabel }}</Label>
  </StackLayout>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import Carbon from '@/support/Date';

@Component
export default class CalendarGridDay extends Vue {
  @Prop({ default: () => new Carbon() }) now!: Carbon;
  @Prop({ default: () => {} }) date!: Carbon;

  public get dayLabel() {
    return this.date.day;
  }

  public get classes() {
    return {
      'calendar-day': true,
      'calendar-day--current': this.date.isToday(),
      'calendar-day--inactive': ! this.date.isCurrentMonth(this.now),
    }
  }
}
</script>

<style>
</style>
