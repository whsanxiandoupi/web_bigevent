$(function() {
    getUserInfo()

    let layer = layui.layer

    $('#btnLogout').on('click', function() {
        // 提示用户是否退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token')
                // 2.重新跳转到登录页面
            location.href = '/04-大事件项目课程资料（第九章大事件后台管理系统项目）/day1/mycode/login.html'
            layer.close(index);
        });
    })
})

//   获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //   调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },

    })
}

//渲染用户头像
function renderAvatar(user) {
    // 获取用户名称
    let name = user.nickname || user.username

    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 按需渲染用户头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}