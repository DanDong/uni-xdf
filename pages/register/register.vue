<template>
	<view class="content">
		<view class="tips" :class="tips?'show-tips':''">
			{{tips}}
		</view>
		<view class="logo-box">
			<image class="logo" src="../../static/xdf.png" mode="aspectFill"></image>
		</view>
		<view class="input-box">
			<view class="select-school">
				<view class="title">选择校区</view>
				<picker mode="selector" :range="schoolList" :value="school" range-key="sname" @change="selectChange">
					<view class="picker">
						<view class="selected">{{ schoolList.length > 0 ? schoolList[school].sname : ''}}</view>
						<image class="arrow-right" src="../../static/down-black.png" mode="aspectFill"></image>
					</view>
				</picker>
			</view>
			<input type="text" v-model="uname" placeholder="请输入用户名"/>
			
			<input type="text" v-model="phone" placeholder="请输入手机号" @blur="validPhone" maxlength="11"/>
			<input type="password" v-model="password"  placeholder="请输入密码" @blur="validPwd" maxlength="18"/>
		</view>
		<view class="btn" @tap="register">立即注册</view>
		<view class="login">
			<view class="grey">已有账号？</view>
			<view class="color" @tap="$clickTo('../login/login')">直接登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uname: '',
				phone: '',
				password: '',
				tips: '',
				schoolList: [],
				school: 0
			};
		},
		onLoad() {
			this.getSchoolList()
		},
		methods:{
			// 校验手机号
			validPhone(){
				var phonereg=/^[1][0-9]{10}$/;
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
					this.tips = '密码为6-18位字母、数字、下划线'
				}else{
					this.tips = ''
				}
			},
			register(){
				uni.showLoading({
					title: '加载中'
				})
				uni.hideKeyboard()
				if(this.uname && this.phone && this.password && this.schoolList[this.school].id && !this.tips){
					let data = {
						uname: this.uname,
						phone: this.phone,
						password: this.password,
						sid: this.schoolList[this.school].id
					}
					this.$http('post', '/user/register', data).then(res => {
						if(res.code === 10000){
							uni.setStorageSync('phone', res.data.phone)
							// 调登录接口
							let data2 = {
								phone:this.phone,
								password:this.password
							}
							this.$http('post', '/user/login', data2).then(res2=>{
								if(res2.code === 10000){
									this.$store.commit('updateToken', res2.data.token)
									this.$store.dispatch('getUserInfo', this)
									uni.reLaunch({
										url: '/pages/index/index'
									})
									uni.showToast({
										title: '登录成功',
										icon:'none'
									})
								}
								uni.hideLoading()
							})
							uni.reLaunch({
							    url: '/pages/index/index'
							})
						} else {
							uni.showToast({
								title: res.msg || '注册失败',
								icon:'none'
							})
						}
						uni.hideLoading()
					})
				}
				uni.hideLoading()
			},
			// 选择校区
			selectChange(e){
				this.school = e.target.value
			},
			// 获取校区列表
			getSchoolList(){
				this.$http('get', '/user/schoolList').then(res => {
					if(res.code === 10000){
						this.schoolList = res.data
					}
				})
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
		margin-top: 50upx;
		.logo{
			width:300upx;
			height:190upx;
		}
	}
	.input-box{
		width: 560upx;
		margin-top: 70upx;
		margin-bottom: 30upx;
		.select-school{
			display:flex;
			align-items: center;
			justify-content: space-between;
			border-bottom:$border;
			height:80upx;
			font-size:32upx;
			padding: 0 8upx;
			margin-bottom: 30upx;
			.picker{
				display: flex;
				align-items: center;
			}
			.arrow-right{
				width:40upx;
				height:20upx;
				margin-left:10upx;
			}
		}
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
	.login{
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
