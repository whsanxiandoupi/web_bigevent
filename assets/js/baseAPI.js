// 每次调用$.get(),$.post(),$.ajax()时会先调用这个函数
$.ajaxPrefilter(function(options) {
    // 发起ajax前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 统一为有权限的接口，设置header请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局挂载complete回调函数
    // 无论获取信息成功还是失败都会调用complete回调函数
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token')
            location.href = '/04-大事件项目课程资料（第九章大事件后台管理系统项目）/day1/mycode/login.html'
        }
    }
})