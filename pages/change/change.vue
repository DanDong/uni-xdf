<template>
	<view>
		<view class="title">旧密码</view>
		<input type="password" v-model="oldPass" placeholder="请输入旧密码"/>
		<view class="title">新密码</view>
		<input type="password" v-model="password" placeholder="请输入6-20个字符"/>
		<view class="title">确认密码</view>
		<input type="password" v-model="confirm" placeholder="请重新输入新密码"/>
		<view class="btn" @tap="change">确认修改</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPass: '',
				password: '',
				confirm: ''
			};
		},
		methods:{
			change(){
				if(this.password === this.confirm){
					let data = {
						oldpassword: this.oldPass,
						password: this.password
					}
					this.$http('put', '/user/password', data).then(res => {
						if(res.code === 10000){
							uni.showToast({
								title: res.data.msg,
								icon:'success'
							})
							setTimeout(() => {
								uni.navigateBack()
							},1000)
						}
					})
				} else {
					uni.showToast({
						title:'两次密码输入不一致',
						icon:'none'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.title{
	padding:0 30upx;
	font-size:30upx;
	color:#666;
	height:80upx;
	display: flex;
	align-items: center;
}
input{
	padding: 0 30upx;
	font-size:36upx;
	height:100upx;
	line-height: 100upx;
	background:#fff;
}
.btn{
	width:560upx;
	height:80upx;
	background:$basecolor;
	border-radius: 8upx;
	display: flex;
	justify-content: center;
	align-items: center;
	color:#fff;
	font-size:36upx;
	margin:0 auto;
	margin-top:50upx;
}
</style>
