<template>
	<view class="content">
		<view class="tips" :class="tips?'show-tips':''">
			{{tips}}
		</view>
		<view class="logo-box">
			<image class="logo" src="../../static/xdf.png" mode="aspectFill"></image>
		</view>
		<view class="input-box">
			<input type="text" v-model="phone" placeholder="请输入手机号" @blur="validPhone" maxlength="11"/>
			<input type="password" v-model="password"  placeholder="请输入密码" @blur="validPwd" maxlength="18"/>
		</view>
		<view class="btn" @tap="login">登录</view>
		<view class="register">
			<view class="grey">还没有账号？</view>
			<view class="color" @tap="$clickTo('../register/register')">立即注册</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				password: '',
				tips: '',
			};
		},
		onLoad() {
			let token = uni.getStorageSync('token')
			let phone = uni.getStorageSync('phone')
			if(phone){
				this.phone = phone
			}
		},
		methods:{
			// 校验手机号
			validPhone(){
				var phonereg=/^[1][0-9]{10}$/
				if (!phonereg.test(this.phone)) {
					this.tips = '请检查11位手机号码输入是否正确'
				}else{
					this.tips = ''
				}
			},
			// 校验密码
			validPwd(){
				var passwordreg=/^\w{6,18}$/;
				if (!passwordreg.test(this.password)) {
					this.tipMsg = '密码为6-18位字母、数字、下划线'
				}else{
					this.tipMsg = ''
				}
			},
			// 手机号密码登录
			login(){
				if(this.phone && this.password && !this.tips){
					uni.showLoading({
						title: '登录中'
					})
					uni.hideKeyboard()
					let data = {
						phone:this.phone,
						password:this.password
					}
					this.$http('post', '/user/login', data).then(res=>{
						if(res.code === 10000){
							console.log(res.code === 10000, res.code)
							uni.setStorageSync('phone', this.phone)
							this.$store.commit('updateToken', res.data.token)
							this.$store.dispatch('getUserInfo', this)
							uni.reLaunch({
								url: '/pages/index/index'
							})
							uni.showToast({
								title: '登录成功',
								icon:'none'
							})
						} else {
							uni.showToast({
								title: res.msg || '登录失败',
								icon:'none'
							})
						}
						uni.hideLoading()
					}).catch(error => {
						uni.hideLoading()
						uni.showToast({
							title: '登录失败',
							icon:'none'
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.logo-box{
		width:100%;
		height:300upx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 100upx;
		.logo{
			width:300upx;
			height:190upx;
		}
	}
	.input-box{
		width: 560upx;
		margin-top: 120upx;
		margin-bottom: 30upx;
		input{
			border-bottom: $border;
			height:80upx;
			padding: 0 10upx;
			line-height: 80upx;
			margin-bottom: 30upx;
		}
	}
	.btn{
		width:560upx;
		height:80upx;
		background: $basecolor;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36upx;
		color:#fff;
		font-weight: 500;
		border-radius: 10upx;
		margin: 30upx;
	}
	.register{
		display: flex;
		align-items: center;
		justify-content: center;
		.grey{
			color:#666;
		}
		.color{
			color: $basecolor;
		}
	}
	.other-box{
		position: absolute;
		bottom: 120upx;
		.title-box{
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom:30upx;
			.heng{
				width:90upx;
				height:1px;
				background:#979797;
				margin: 0 20upx;
			}
			.text{
				color:#666;
			}
		}
		.wechat{
			display: flex;
			justify-content: space-around;
			image{
				width:80upx;
				height:80upx;
				border-radius: 50%;
			}
		}
	}
	.tips{
		position: absolute;
		top:0;
		left:0;
		transition: all 0.5s;
		width:100%;
		height:0;
		background: #FFDDE2;
		color:red;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.show-tips{
		height:70upx;
	}
</style>
