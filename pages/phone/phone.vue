<template>
	<view>
		<view class="input-box">
			<input type="text" v-model="phone" placeholder="请输入手机号码"/>
		</view>
		<view class="btn" @tap="change">确认修改</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone:''
			};
		},
		onLoad() {
			this.phone = this.$store.state.userInfo.phone || ''
		},
		methods:{
			change(){
				if(this.phone){
					this.$http('put', '/user/phone', {phone:this.phone}).then(async res => {
						if(res.code === 10000){
							// 更新本地缓存的手机号
							uni.setStorageSync('phone', this.phone)
							// 更新用户信息
							await this.$store.dispatch('getUserInfo', this)
							uni.showToast({
								title: res.data.msg,
								icon:'success'
							})
							setTimeout(() => {
								uni.navigateBack()
							},1000)
						} else {
							uni.showToast({
								title: res.msg,
								icon:'none'
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.input-box{
		background: #fff;
		margin-top:16upx;
		input{
			height:100upx;
			padding:0 30upx;
		}
	}
	.btn{
		width:560upx;
		height:80upx;
		border-radius: 10upx;
		background: $basecolor;
		display: flex;
		justify-content: center;
		align-items: center;
		color:#fff;
		font-size:36upx;
		margin:0 auto;
		margin-top:50upx;
	}
</style>
