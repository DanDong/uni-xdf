<template>
	<view>
		<view class="tips">*需要统计的校区请开启开关</view>
		<view class="list-box">
			<view class="row" v-for="item in schoolList" :key="item.id">
				<view class="sname">{{item.sname}}</view>
				<view class="btn-box">
					<view class="delete" @tap="deleteSchool(item.id, item.sname)">
						<image src="../../static/delete.png" mode="aspectFill"></image>
					</view>
					<view class="bianji" @tap="edit(item.id, item.sname)">
						<image src="../../static/edit2.png" mode="aspectFill"></image>
					</view>
					<view class="kaiguan">
						<switch :checked="item.status === 1" @change="switchChange($event, item.id)" color="#016864"/>
					</view>
				</view>
			</view>
			<view class="row add-school" @tap="addSchool">添加校区</view>
		</view>
		<view class="edit-box" v-if="showDialog">
			<view class="edit">
				<input type="text" v-model="editSname" placeholder="请输入校区名称" :focus="isFocus"/>
				<view class="btn-box">
					<view class="btn cancel" @tap="cancel">取消</view>
					<view style="width:1px;height:120upx;background:#e2e2e2"></view>
					<view class="btn save" @tap="save">保存</view>
				</view>
			</view>
		</view>
		<view class="edit-box" v-if="showAddDialog">
			<view class="edit">
				<input type="text" v-model="editSname" placeholder="请输入校区名称" :focus="isFocus"/>
				<view class="btn-box">
					<view class="btn cancel" @tap="cancel">取消</view>
					<view style="width:1px;height:120upx;background:#e2e2e2"></view>
					<view class="btn save" @tap="saveAdd">保存</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				schoolList: [],
				editSname: '',
				editSid: '',
				showDialog: false,
				isFocus:false,
				showAddDialog:false
			};
		},
		onLoad() {
			this.getList()
		},
		methods:{
			async switchChange(e, id){
				let data = {
					sid: id,
					status: e.target.value ? 1 : 0
				}
				let res = await this.$http('put', '/user/setSchoolStatus', data)
				if(res.code === 10000){
					uni.showToast({
						title:res.data.msg,
						icon:'none'
					})
				}
			},
			// 获取列表
			async getList(){
				let res = await this.$http('get', '/user/schoolListAll')
				if(res.code === 10000){
					this.schoolList = res.data
				}
			},
			// 删除
			deleteSchool(id, sname){
				uni.showModal({
					title: '删除',
					content: `确定删除${sname}校区吗？`,
					success: (res) => {
						if (res.confirm) {
							this.$http('delete', '/user/school', {sid:id}).then(res2 => {
								if(res2.code === 10000){
									uni.showToast({
										title:res2.data.msg,
										icon:'none'
									})
									this.getList()
								}
							})
						} else if (res.cancel) {
								console.log('取消');
						}
					}
				})
			},
			// 点击编辑按钮
			edit(id, sname){
				this.editSid = id
				this.editSname = sname
				this.showDialog = true
				this.isFocus = true
			},
			// 点击取消按钮
			cancel(){
				this.editSid = ''
				this.editSname = ''
				this.showDialog = false
				this.showAddDialog = false
				this.isFocus = false
			},
			// 点击保存按钮
			save(){
				let data = {
					sid: this.editSid,
					sname: this.editSname
				}
				this.$http('put', '/user/editSchool', data).then(res => {
					if(res.code === 10000){
						this.editSid = ''
						this.editSname = ''
						this.showDialog = false
						this.isFocus = false
						uni.showToast({
							title: '修改成功',
							icon:'none'
						})
						this.getList()
					}
				})
			},
			// 点击添加的保存按钮
			saveAdd(){
				this.$http('post', '/user/addSchool', {sname: this.editSname}).then(res => {
					if(res.code === 10000){
						this.editSname = ''
						this.showAddDialog = false
						this.isFocus = false
						uni.showToast({
							title: '添加成功',
							icon:'none'
						})
						this.getList()
					}
				})
			},
			// 新建校区
			addSchool(){
				this.showAddDialog = true
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
	.add-school{
		justify-content: center;
		font-size:36upx;
		color:$basecolor;
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
		height:260upx;
		background: #FFFFFF;
		border-radius: 10upx;
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
