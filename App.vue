<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 如果本地没有token跳转登录页
			let token = uni.getStorageSync('token')
			if(token){
				this.$store.dispatch('getUserInfo', this)
			} else {
				uni.reLaunch({
					url:'pages/login/login'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	body{
		font-size:13px;
	}
	page{
		background:#fafafa;
	}
	//重置部分uni-app的样式
	uni-button:after{
		border:none;
	}
	.button-hover{
		background:#dba01a;
		color:#fff;
	}
	//设置输入框提示文字样式
	.input-placeholder{
		color:#bbb;
	}
	//优化图片加载闪烁问题
	image{will-change: transform;}
</style>
