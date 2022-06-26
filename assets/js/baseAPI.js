// 每次调用$.get(),$.post(),$.ajax()时会先调用这个函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
})