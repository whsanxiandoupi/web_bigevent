$(function() {

    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                let htmlStr = template('tpl-id', res)
                    // console.log(typeof htmlStr);
                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layui.layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '300px'],
            content: $('#dialog-add').html()
        });
    })

    // 通过代理形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('添加失败')
                }

                initArtCateList()
                layui.layer.msg(res.message)
                layui.layer.close(indexAdd)
            }
        })
    })

    // 通过代理，为btn-edit绑定点击事件
    let indexEdit = null
    $('tbody').on('click', '#btn-edit', function(e) {
        e.preventDefault()

        indexEdit = layui.layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                layui.form.val('form-edit', res.data)
            }

        })
    })

    // 通过代理形式,为修改分类的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类数据失败')
                }
                layui.layer.msg(res.message)
                layui.layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理给删除按钮绑定事件
    $('tbody').on('click', '#btn-del', function(e) {
        e.preventDefault()

        let id = $(this).attr('data-id')
        console.log(id);
        layui.layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {

                        return layui.layer.msg('删除失败')

                    }
                    layui, layer.msg(res.message)
                    layui.layer.close(index);
                    initArtCateList()
                }
            })

        });
    })

})