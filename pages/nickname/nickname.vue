<template>
	<view>
		<view class="input-box">
			<input type="text" v-model="uname" placeholder="请输入昵称"/>
		</view>
		<view class="btn" @tap="change">确认修改</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uname:''
			};
		},
		onLoad() {
			this.uname = this.$store.state.userInfo.uname || ''
		},
		methods:{
			change(){
				if(this.uname){
					this.$http('put', '/user/uname', {uname:this.uname}).then(async res => {
						if(res.code === 10000){
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
