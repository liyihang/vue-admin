import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import './assets/css/all.css'
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// global datetime filter
Vue.filter('dateFormat', function (oriVal) {
  const datet = new Date(oriVal)
  const y = (datet.getFullYear() + '').padStart(2, 0)
  const m = (datet.getMonth() + 1 + '').padStart(2, 0)
  const d = (datet.getDay() + '').padStart(2, 0)
  const hh = (datet.getHours() + '').padStart(2, 0)
  const mm = (datet.getMinutes() + '').padStart(2, 0)
  const ss = (datet.getSeconds() + '').padStart(2, 0)

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
