import Vue from 'vue'
import App from './App'
import store from './store'  
import util from './common/util.js'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$http = util.http
Vue.prototype.$clickTo = util.clickTo
Vue.prototype.$util = util

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
