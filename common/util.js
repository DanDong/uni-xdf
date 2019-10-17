const baseUrl = 'http://47.107.90.142:3040/v1'

// 封装请求
function http(method, url, data){
	return new Promise((reslove,reject)=>{
		uni.request({
			method: method,
			url: baseUrl + url, 
			data: data,
			header: {
				'content-type': "application/x-www-form-urlencoded",
				'token': uni.getStorageSync('token')
			},
			success: (res) => {
				if(res.statusCode && res.statusCode === 200){
					if(res.data.code === 10030 || res.data.code === 10031 || res.data.code === 10032){
						uni.reLaunch({
							url:'/pages/login/login.vue'
						})
					}
					reslove(res.data)
				} else {
					reject(res)
				}
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

// 格式化时长
function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600000)
	time = time % 3600000
	var minute = parseInt(time / 60000)
	time = time % 60000
	var second = parseInt(time / 1000)

	return ([hour, minute, second]).map(function (n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

// 格式化到天
function getDay(time){
	if (typeof time !== 'number' || time < 0) {
		return time
	}
	let today = new Date().getDate()
	let userDay = new Date(time).getDate()
	if (today === userDay) {
		return '今天'
	} else if(today - userDay === 1) {
		return '昨天'
	} else {
		return userDay + '日'
	} 
}

// 无传参页面跳转
function clickTo(url){
	if(url){
		uni.navigateTo({
			url
		})
	}
}

// 根据时间戳获得日期时间
function getDate(date){
	if (typeof date !== 'number' || date < 0) {
		return date
	}
	var myDate = new Date(parseInt(date))
	var year = myDate.getFullYear()
	var month = myDate.getMonth()+1
	var day = myDate.getDate()
	var hour = myDate.getHours()
	var min = myDate.getMinutes()
	var second = myDate.getSeconds()
	month = month < 10 ? '0' + month : month
	day = day < 10 ? '0' + day : day,
	hour = hour < 10 ? '0' + hour : hour
	min = min < 10 ? '0' + min : min,
	second = second < 10 ? '0' + second : second
	return `${year}-${month}-${day} ${hour}:${min}:${second}`
}

export default {
	http,
	formatTime,
	getDate,
	getDay,
	clickTo
}

