<template>
	<view class="content">
		<view class="top-box">
			<view class="name-row">
				<view class="name">
					<view class="select">{{userInfo.uname}}</view>
				</view>
				<view class="right-btn" @tap="$clickTo('../person/person')">
					<view class="status">修改资料</view>
					<image class="arrow-right" src="../../static/arrow-right-white.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="school">
				所属校区：{{userInfo.sname || '---'}}
			</view>
		</view>
		<view class="info-box">
			<view class="item">
				<view class="num">{{userInfo.total || '--'}}</view>
				<view class="name">8月课标</view>
			</view>
			<view class="item">
				<view class="num">{{userInfo.current || '--'}}</view>
				<view class="name">8月预排</view>
			</view>
			<view class="item">
				<view class="num">{{userInfo.current - userInfo.total || '--'}}</view>
				<view class="name">差值</view>
			</view>
		</view>
		<view class="manager-box">
			<view class="row-left">更新预排</view>
			<view class="row-center">
				<input type="number" v-model="preNum" placeholder="请输入预排课时" :focus="isFocus"/>
				<image class="edit-icon" src="../../static/edit.png" mode="aspectFill" @tap="isFocus = true"></image>
			</view>
			<view class="row-center">
				<slider :value="preNum" max="300" @change="sliderChange" activeColor="#1987B1" block-color="#1987B1" block-size="11" show-value/>
			</view>
		</view>
		<view class="btn-box">
			<view>*上次提交时间：{{lastTime || '--:--'}}</view>
			<view class="btn" @tap="clickMainBtn">
				提交
			</view>
			<view class="manager-entry" @tap="$clickTo('../manager/manager')" v-if="userType>2">管理员入口</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				preNum: 0,
				isFocus: false
			}
		},
		computed:{
			userInfo(){
				return this.$store.state.userInfo
			},
			lastTime(){
				return this.$util.getDate(this.userInfo.updateTime)
			},
			userType(){
				return this.$store.getters.userType
			}
		},
		watch:{
			userInfo(){
				this.preNum = this.userInfo.current
			}
		},
		methods: {
			sliderChange(e){
				this.preNum = e.detail.value
			},
			clickMainBtn(){
				uni.showModal({
					title: '确定提交吗？',
					content: '上次提交时间：' + this.$util.getDate(this.userInfo.updateTime),
					success: (resM) => {
						if (resM.confirm) {
							this.$http('put', '/user/current', {current: this.preNum}).then(res => {
								if(res.code === 10000){
									uni.showToast({
										title: res.data.msg,
										icon:'none'
									})
									this.$store.dispatch('getUserInfo', this)
								}
							})
						} else if (resM.cancel) {
							console.log('取消');
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding-bottom: 220upx;
		.top-box{
			width:100%;
			height:300upx;
			background:linear-gradient(180deg,#016864 0%,#09a8a1 100%);
			.name-row{
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top:50upx;
				position: relative;
				.name{
					padding-left:30upx;
					padding-right: 40upx;
					border-radius: 0 40upx 40upx 0;
					height:80upx;
					display: flex;
					justify-content: center;
					align-items: center;
					background:rgba(255,255,255,0.4);
					.select{
						color:#fff;
						font-size: 32upx;
						font-weight: 500;
					}
				}
				.right-btn{
					display: flex;
					align-items: center;
					color:#fff;
					margin-right:50upx;
					font-size:30upx;
					.arrow-right{
						width: 20upx;
						height: 40upx;
						margin-left:20upx;
					}
				}
			}
			.school{
				color:#fff;
				margin-left:30upx;
				margin-top:40upx;
				font-size:26upx;
			}
		}
	}
	.info-box{
		display: flex;
		justify-content: space-around;
		align-items: center;
		background:#016864;
		height:140upx;
		.item{
			text-align: center;
			color:#fff;
			.num{
				font-size:32upx;
				font-weight: 500;
				margin-bottom:6upx;
			}
		}
	}
	.manager-box{
		.row-left{
			height:100upx;
			background: #fff;
			padding:0 30upx;
			font-size:32upx;
			line-height: 100upx;
		}
		.row-center{
			display: flex;
			align-items: center;
			justify-content: center;
			background: #fff;
			border-top:$border;
			padding:20upx 30upx;
			position: relative;
			slider{
				width: 650upx;
			}
			input{
				text-align: center;
				height:160upx;
				font-size:80upx;
			}
			.edit-icon{
				width:40upx;
				height:40upx;
				position:absolute;
				right:100upx;
				bottom:60upx;
			}
		}
	}
	.btn-box{
		position: absolute;
		bottom:0;
		left:0;
		padding:30upx;
		width:690upx;
		background:#fff;
		.btn{
			width:690upx;
			height:80upx;
			border-radius: 8upx;
			background:$basecolor;
			display: flex;
			justify-content: center;
			align-items: center;
			color:#fff;
			font-size:32upx;
			margin: 20upx auto;
		}
		.manager-entry{
			text-align: center;
			color: $basecolor;
			text-decoration: underline;
			font-size:30upx;
		}
	}
</style>
