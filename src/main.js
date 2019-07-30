import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import './assets/css/all.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
