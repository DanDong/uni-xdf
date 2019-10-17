<template>
	<view>
		<view class="row" @tap="$clickTo('../nickname/nickname')">
			<view class="left">昵称</view>
			<view class="right-box">
				<view class="text">{{uname}}</view>
				<image src="../../static/arrow-right.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="row">
			<view class="left">校区</view>
			<view class="right-box">
				<picker mode="selector" :range="schoolList" :value="school" range-key="sname" @change="selectChange">
					<view class="picker">
						<view class="selected">{{ schoolList.length > 0 ? schoolList[school].sname : ''}}</view>
						<image src="../../static/arrow-right.png" mode="aspectFill"></image>
					</view>
				</picker>
			</view>
		</view>
		<view class="row" @tap="$clickTo('../phone/phone')">
			<view class="left">手机号</view>
			<view class="right-box">
				<view class="text">{{phone}}</view>
				<image src="../../static/arrow-right.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="row" @tap="$clickTo('../change/change')">
			<view class="left">修改密码</view>
			<view class="right-box">
				<image src="../../static/arrow-right.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="logout" @tap="logout">
			<view class="left">退出登录</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				schoolList: [],
				school: 0
			};
		},
		onShow() {
			this.$store.dispatch('getUserInfo', this)
		},
		onLoad() {
			this.getSchoolList()
		},
		computed:{
			uname(){
				return this.$store.state.userInfo.uname || ''
			},
			phone(){
				return this.$store.state.userInfo.phone || ''
			},
			oldschool(){
				return this.$store.state.userInfo.sname || ''
			}
		},
		methods:{
			logout(){
				this.$store.commit('logout')
				uni.reLaunch({
				    url: '../login/login'
				})
			},
			// 选择校区
			selectChange(e){
				this.school = e.target.value
				this.$http('put', '/user/setUserSchool', {sid:this.schoolList[e.target.value].id}).then(res => {
					if(res.code === 10000){
						uni.showToast({
							title: '校区修改成功',
							icon:'none'
						})
						this.$store.dispatch('getUserInfo', this)
					}
				})
			},
			// 获取校区列表
			getSchoolList(){
				this.$http('get', '/user/schoolList').then(res => {
					if(res.code === 10000){
						this.schoolList = res.data
						for(var i=0; i<this.schoolList.length; i++){
							if(this.schoolList[i].sname === this.oldschool){
								this.school = i
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.avatar{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding:30upx;
	height:100upx;
	background:#fff;
	margin:20upx 0;
	.left{
		font-size:36upx;
	}
	image{
		width:120upx;
		height:120upx;
		border-radius: 50%;
		background: #ccc;
	}
}
.row{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding:30upx;
	height:60upx;
	background:#fff;
	border-bottom: $border;
	&:last-child{
		border-bottom: none;
	}
	.left{
		font-size:36upx;
	}
	.right-box{
		display: flex;
		align-items: center;
		.text{
			font-size:30upx;
		}
		image{
			width:20upx;
			height:30upx;
			margin-left: 20upx;
		}
	}
	.picker{
		display: flex;
		align-items: center;
	}
}
.logout{
	padding:30upx;
	height:60upx;
	background:#fff;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size:36upx;
	color:red
}
</style>
