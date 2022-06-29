$(function() {

    let laypage = layui.laypage;

    // 定义美化事件过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = dt.getMonth() + 1
        let d = dt.getDate()

        let hh = dt.getHours()
        let mm = dt.getMinutes()
        let ss = dt.getSeconds()

        return y + '-' + m + '-' + '-' + d + ' ' + hh + ':' + mm + ":" + ss
    }

    let q = {
        pagenum: 1, //页码值
        pagesize: 10, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据方法，接口好像有问题了
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面数据
                console.log(res.data);
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)

                // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败！')
                }
                let htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                    // 通知layui重新渲染表单区域
                layui.form.render()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染·分页
        laypage.render({
            elem: 'pageBox', //容器Id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中页数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时，触发jump回调
            // 触发jump回调方式有两种。1.点击页码值 2.只要调用laypage.render()方法
            jump: function(obj, first) {
                // 可以通过first值判断通过哪种方式触发，true为方式2触发
                // 把最新的页码值赋值到q这个查询对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit

                if (!first) {
                    initTable()
                }

            }
        })


    }

    // 通过代理形式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
        // 获取删除按钮个数
        let len = $('.btn-delete').length
            // 获取到文章id
        let id = $(this).attr('data-id')
            // 询问用户是否删除消息
        layer.confirm('确认删除q?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除文章失败')

                    }
                    layui.layer.msg(res.message)

                    // 如果没有剩余数据，则让页码值减1，再重新调用initTabel()
                    if (len === 1) {
                        //如果len值为1，证明删除完毕。该页面上没有数据
                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }

            })

            layer.close(index);
        });
    })
})