$(function() {

    let layer = layui.layer
    let form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章失败！')
                }
                console.log(res);
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function(e) {
        let files = e.target.files
        if (files[0].length === 0) {
            return
        }

        let newImgURL = URL.createObjectURL(files[0])
            //  为裁剪区重新设置图片路径
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 定义文章发布状态
    let art_state = '已发布'

    $('#btnSave2').on('click', function() {
        art_state = '草稿'
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 基于form表单， 快速创建一个FormData对象
        let fd = new FormData($(this)[0])

        fd.append('state', art_state)
        console.log(fd);

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)

                publishArticle(fd)
            })

    })

    // 定义发布文章函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果向服务器提交FormData格式数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功！')
                console.log(res);
                location.href = '/04-大事件项目课程资料（第九章大事件后台管理系统项目）/day1/mycode/article/art_list.html'
            }
        })
    }
})