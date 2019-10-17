import Vue from 'vue'                             //引入vue 
import Vuex from 'vuex'                           //引入vuex

Vue.use(Vuex)         //注册vuex

const store = new Vuex.Store({
  state: {
		token: '',
		userInfo: {}
  },
  mutations: {
		updateToken(state, token){
			state.token = token
			uni.setStorageSync('token', token)
		},
    updateInfo(state, info){
    	Object.assign( state.userInfo, info)
			state.userInfo = Object.assign({}, state.userInfo)
    },
    logout(state) {
    	state.token = null;
    	state.userInfo = {};
    	uni.removeStorageSync('token')
    }
  },
	getters: {
    userType(state){
			return state.userInfo.type
		}
  },
	actions:{
		// 获取个人数据
		getUserInfo(ctx, _this){
			_this.$http('get', '/user/info').then(res => {
				if(res.code === 10000){
					ctx.commit('updateInfo', res.data)
				}
			})
		}
	}
}) 

export default store