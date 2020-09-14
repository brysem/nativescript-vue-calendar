<template>
  <StackLayout class="calendar-header">
    <Label>{{ dayLabel }}</Label>
  </StackLayout>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';
import { en } from '@/support/Date/Locales';
import Carbon from '@/support/Date';

@Component
export default class CalendarGridHeader extends Vue {
  @Prop({ default: 1 }) day!: number;

  public get dayLabel() {
    return (new Carbon()).getLocale().days[this.day - 1].substr(0, 3).toUpperCase();
  }
}
</script>

<style>
</style>
