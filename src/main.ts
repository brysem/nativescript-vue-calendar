import Vue from 'nativescript-vue'
import App from './components/App.vue'
import VueDevtools from 'nativescript-vue-devtools'
import Calendar from './components/Calendar/Calendar.vue'
import store from './store'
import Carbon from './support/Date'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}

Carbon.locale = 'en';

Vue.config.silent = (TNS_ENV === 'production')
Vue.config.suppressRenderLogs = true;

Vue.component('Calendar', Calendar);




new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()
