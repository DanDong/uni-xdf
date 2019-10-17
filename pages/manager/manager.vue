<template>
	<view>
		<view class="top-btn">
			<view class="btn-box" @tap="$util.clickTo('../school/school')">
				<image src="../../static/school.png" mode="aspectFill"></image>
				<view>校区管理</view>
			</view>
			<view class="btn-box" @tap="$util.clickTo('../teacher/teacher')">
				<image src="../../static/teacher.png" mode="aspectFill"></image>
				<view>教师管理</view>
			</view>
		</view>
		<view style="width:100%;height:16upx;background:#f2f2f2"></view>
		<view class="tongji-box">
			<view class="title-box">
				<view class="title">实时统计</view>
				<view class="fresh-btn" @tap="freshData">
					<image src="../../static/fresh.png" mode="aspectFill"></image>
					<view class="text">刷新</view>
				</view>
			</view>
			<view class="list teacher-list">
				<view class="tips">教师列表</view>
				<view class="row">
					<view class="name-box">
						<view class="name">姓名</view>
					</view>
					<view class="total">课标</view>
					<view class="current">预排</view>
					<view class="cha">差值</view>
					<view class="time" style="font-weight: 600;">时间</view>
				</view>
				<view class="row" v-for="item in teacherList" :key="item.id">
					<view class="name-box">
						<view class="name">{{item.uname}}</view>
						<view class="school">{{item.sname}}</view>
					</view>
					<view class="total">{{item.total}}</view>
					<view class="current">{{item.current}}</view>
					<view class="cha">{{item.current - item.total}}</view>
					<view class="time">{{$util.getDay(item.updateTime)}}</view>
				</view>
			</view>
			<view class="school-list">
				<view class="tips">校区列表</view>
				<view class="row">
					<view class="school">校区</view>
					<view class="total">总课标</view>
					<view class="current">总预排</view>
					<view class="history">上次预排</view>
					<view class="cha">差值</view>
				</view>
				<view class="row" v-for="itemSchool in schoolList" :key="itemSchool.id">
					<view class="school">{{itemSchool.sname}}</view>
					<view class="total">{{itemSchool.total}}</view>
					<view class="current">{{itemSchool.current}}</view>
					<view class="history">{{itemSchool.history}}</view>
					<view class="cha">{{itemSchool.current - itemSchool.history}}</view>
				</view>
			</view>
			<view class="textarea" v-if="resultText">
				<textarea v-model="resultText" placeholder="请点击生成结果按钮" maxlength="-1" auto-height/>
			</view>
			<view class="btn" @tap="result">
				生成结果
			</view>
			<view class="btn btn-border" @tap="submit">
				保存日志
			</view>
			<view class="last-time">*上次提交时间：{{lastTime}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				resultText: '',
				teacherList: [],
				schoolList:[],
				lastTime:''
			}
		},
		onShow(){
			this.getTeacherList().then(() => {
				this.getSchoolList()
			})
			
		},
		methods: {
			// 获取教师列表数据
			async getTeacherList(){
				let res = await this.$http('get', '/user/list')
				this.teacherList = res.data
			},
			// 获取学校列表数据
			async getSchoolList(){
				// 获取学校列表
				let res = await this.$http('get', '/user/schoolList')
				let listData = []
				if(res.code === 10000){
					listData = res.data
					listData.map(item => {
						item.current = 0
						item.total = 0
						item.history = 0
					})
					for(var i=0; i<this.teacherList.length; i++){
						for(var j=0; j<listData.length; j++){
							if(this.teacherList[i].sid === listData[j].id){
								listData[j].current += this.teacherList[i].current
								listData[j].total += this.teacherList[i].total
							}
						}
					}
				}
				
				// 获取历史记录
				let res2 = await this.$http('get', '/user/log')
				if(res2.code === 10000 && res2.data[0].submitData){
					let history = JSON.parse(res2.data[0].submitData)
					for(var i=0; i<history.length; i++){
						for(var j=0; j<listData.length; j++){
							if(history[i].sid == listData[j].id){
								listData[j].history = history[i].current
							}
						}
					}
					this.lastTime = this.$util.getDate(res2.data[0].createTime)
				}
				
				this.schoolList = listData
			},
			// 点击生成结果按钮
			result(){
				let total = 0
				let current = 0
				let chaTotal = 0
				let reduceStr = ''  
				let time = new Date().getMonth()+1
				this.schoolList.map(item => {
					total += item.total
					current += item.current
					chaTotal += (item.current - item.history)
					if(item.current - item.history < 0){
						reduceStr += `,${item.name}取消${item.last-item.current}`
					}
				})
				if(reduceStr){
					reduceStr = '('+reduceStr.substring(1)+')'
				}
				
				// 达标人数
				let ok_people = 0 
				this.teacherList.map(item2 => {
					if(item2.current - item2.total > 0){
						ok_people++
					}
				})
				
				this.resultText = `高中语文组${time}月课时汇总：\n课标：${total} ；\n8月已排：${current}；\n今日${chaTotal>=0?'新增':'减少'}：${chaTotal}${reduceStr};\n达标人数：${ok_people} / ${this.teacherList.length} `
			},
			// 点击提交日志按钮
			submit(){
				uni.showModal({
					title: '确认提交吗？',
					content: '上次提交时间：' + this.lastTime,
					success: (resM) => {
						if (resM.confirm) {
								// 加工成下列数据
								let listData = []
								for(var i=0; i<this.schoolList.length; i++){
									listData.push({
										sid: this.schoolList[i].id,
										sname: this.schoolList[i].sname,
										current: this.schoolList[i].current,
									})
								}
								let data = {
									info: JSON.stringify(listData)
								}
								this.$http('post', '/user/log', data).then(res => {
									if(res.code === 10000){
										this.freshData()
									}
								})
						} else if (resM.cancel) {
								console.log('取消');
						}
					}
				})
			},
			// 点击刷新按钮
			freshData(){
				this.getTeacherList().then(() => {
					this.getSchoolList().then(() => {
						uni.showToast({
							title:'数据更新成功',
							icon:'none'
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss">
.top-btn{
	width:100%;
	height:200upx;
	background:#fff;
	display: flex;
	justify-content: space-around;
	align-items: center;
	.btn-box{
		font-size:34upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		image{
			width: 64upx;
			height:64upx;
			margin-bottom:20upx;
		}
	}
}
.tongji-box{
	background:#fff;
	.title-box{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height:100upx;
		padding: 0 30upx;
		.title{
			font-size:32upx;
		}
		.fresh-btn{
			display: flex;
			align-items: center;
			image{
				width:30upx;
				height:30upx;
			}
			.text{
				font-size:26upx;
				color:#666;
				margin-left:20upx;
			}
		}
	}
	.tips{
		width:100%;
		height:60upx;
		display: flex;
		align-items: center;
		background:#f2f2f2;
		font-size:26upx;
		padding-left:30upx;
		padding-right:30upx;
		position: relative;
		left:-30upx;
	}
	.list{
		padding:0 30upx;
		.row{
			display: flex;
			align-items: center;
			border-bottom:$border;
			height:120upx;
			.name-box{
				width:20%;
				text-align: left;
				.name{
					font-size:32upx;
					font-weight: 600;
				}
				.school{
					font-size:24upx;
					color:#666;
				}
			}
			.total{
				width:30%;
				text-align: center;
				font-size:32upx;
				font-weight: 600;
			}
			.current{
				width:20%;
				text-align: center;
				font-size:32upx;
				font-weight: 600;
			}
			.cha{
				width:20%;
				text-align: center;
				font-size:32upx;
				font-weight: 600;
			}
			.time{
				width:10%;
				text-align: right;
			}
		}
	}
	.school-list{
		padding:0 30upx;
		margin-top:30upx;
		.row{
			display: flex;
			align-items: center;
			border-bottom:$border;
			height:120upx;
			.school{
				width:30%;
				text-align: left;
				font-size:32upx;
				font-weight: 600;
			}
			.total{
				width:20%;
				text-align: center;
				font-size:32upx;
				font-weight: 600;
			}
			.current{
				width:20%;
				text-align: center;
				font-size:32upx;
				font-weight: 600;
			}
			.history{
				width:20%;
				text-align: center;
				font-size:32upx;
				font-weight: 600;
			}
			.cha{
				width:10%;
				text-align: center;
				font-size:32upx;
				font-weight: 600;
			}
		}
	}
}
.textarea{
	padding:30upx;
	textarea{
		width:650upx;
		padding:20upx;
		border:$border;
		border-radius:4upx;
	}
}
	
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
	margin-top:50upx;
}
.btn-border{
	background:#fafafa;
	border:1px solid $basecolor;
	color:$basecolor;
	margin-top:40upx;
}
.last-time{
	padding:0 30upx;
	padding-bottom: 50upx;
}
</style>
