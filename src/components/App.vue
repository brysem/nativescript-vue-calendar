<template>
    <Page>
        <ActionBar title="NativeScript-Vue Calendar"/>
        <GridLayout columns="*" rows="*">
            <Calendar />
        </GridLayout>
    </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  private msg: string = 'Hello World!';
}
</script>

<style scoped>
  ActionBar {
      background-color: #53ba82;
      color: #ffffff;
  }
</style>
