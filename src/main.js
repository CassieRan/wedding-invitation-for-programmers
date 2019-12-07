import Vue from 'vue'
import Wedding from './Wedding.vue'
import VConsole from 'vconsole'

new VConsole()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(Wedding)
})