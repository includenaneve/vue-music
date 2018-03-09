import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// import router from './router'
import fastclick from 'fastclick'
import 'common/less/index.less'

Vue.config.productionTip = false

fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})