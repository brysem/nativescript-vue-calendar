<template>
  <GridLayout columns="*" rows="auto, *" padding="20" @swipe="onSwipe">
    <Label row="0" col="0" class="calendar-title">{{ now.format('F Y') }}</Label>
    <GridLayout row="1" col="0" rows="*, *, *, *, *, *, *" columns="*, *, *, *, *, *, *">
      <CalendarGridHeader row="0" :col="i - 1" :day="i" v-for="i in [1, 2, 3, 4, 5, 6, 7]" :key="i" />
      <template v-for="(row, index) in rows">
        <template v-for="(date, dateIndex) in row">
          <CalendarGridDay :row="index + 1" :col="dateIndex" :date="date" :now="now" :key="`${index}-${dateIndex}`" @tap="onTapDate(date)" />
        </template>
      </template>
    </GridLayout>
  </GridLayout>

</template>

<script lang="ts" src="./Calendar.ts" />
<style lang="scss" src="./Calendar.scss" />
