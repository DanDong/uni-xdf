<template>
	<view>
		<view class="tips">*需要统计的教师请开启开关</view>
		<view class="list-box">
			<view class="row" v-for="item in teacherList" :key="item.id">
				<view class="sname">{{item.uname}}</view>
				<view class="total">课标:{{item.total}}</view>
				<view class="btn-box">
					<view class="bianji" @tap="edit(item.id, item.total)">
						<image src="../../static/edit2.png" mode="aspectFill"></image>
					</view>
					<view class="kaiguan">
						<switch :checked="item.status === 1" @change="switchChange($event, item.id)" color="#016864"/>
					</view>
				</view>
			</view>
		</view>
		<view class="edit-box" v-if="showDialog">
			<view class="edit">
				<view class="title">编辑课标</view>
				<input type="text" v-model="editTotal" placeholder="请输入课标" :focus="isFocus"/>
				<view class="btn-box">
					<view class="btn cancel" @tap="cancel">取消</view>
					<view style="width:1px;height:120upx;background:#e2e2e2"></view>
					<view class="btn save" @tap="save">保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teacherList: [],
				editTotal: '',
				editUid: '',
				showDialog: false,
				isFocus:false
			};
		},
		onLoad() {
			this.getList()
		},
		methods:{
			async switchChange(e, id){
				let data = {
					uid: id,
					status: e.target.value ? 1 : 0
				}
				let res = await this.$http('put', '/user/setUserStatus', data)
				if(res.code === 10000){
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
				}
			},
			// 获取列表
			async getList(){
				let res = await this.$http('get', '/user/listAll')
				if(res.code === 10000){
					this.teacherList = res.data
				}
			},
			// 点击编辑按钮
			edit(id, total){
				this.editUid = id
				this.editTotal = total
				this.showDialog = true
				this.isFocus = true
			},
			// 点击取消按钮
			cancel(){
				this.editUid = ''
				this.editTotal = ''
				this.showDialog = false
				this.isFocus = false
			},
			// 点击保存按钮
			save(){
				let data = {
					uid: this.editUid,
					total: this.editTotal
				}
				this.$http('put', '/user/total', data).then(res => {
					if(res.code === 10000){
						this.editUid = ''
						this.editTotal = ''
						this.showDialog = false
						this.isFocus = false
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						})
						this.getList()
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.tips{
	padding:30upx;
}
.list-box{
	padding:0 30upx;
	.row{
		height:120upx;
		border-top:$border;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.sname{
			font-size:32upx;
			font-weight: 600;
			width:20%;
		}
		.btn-box{
			display: flex;
			align-items: center;
			.delete{
				width:60upx;
				height:60upx;
				border-radius: 50%;
				border:1px solid #e16531;
				margin-right:50upx;
				display:flex;
				justify-content: center;
				align-items: center;
			}
			.bianji{
				width:60upx;
				height:60upx;
				border-radius: 50%;
				border:1px solid #515151;
				margin-right:30upx;
				display:flex;
				justify-content: center;
				align-items: center;
			}
			image{
				width:40upx;
				height:40upx;
			}
			switch{
				transform:scale(0.7)
			}
		}
	}
}
.edit-box{
	position:absolute;
	top:0;
	left:0;
	width:100%;
	height:100%;
	background:rgba(0,0,0,.3);
	display:flex;
	align-items:center;
	justify-content:center;
	.edit{
		width:600upx;
		height:340upx;
		background: #FFFFFF;
		border-radius: 10upx;
		.title{
			line-height:80upx;
			border-bottom: $border;
			padding:0 30upx;
		}
		input{
			height:120upx;
			padding:10upx 30upx;
			border-bottom:$border;
			text-align: center;
		}
		.btn-box{
			display: flex;
			align-items: center;
			justify-content: space-around;
			height:120upx;
			.btn{
				width:50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size:32upx;
			}
			.save{
				color:$basecolor;
			}
		}
	}
}
</style>
