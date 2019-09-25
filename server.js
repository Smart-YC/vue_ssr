const exp = require('express')
const express = exp()
const renderer = require('vue-server-renderer').createRenderer({
    template: require('fs').readFileSync('./index.html', 'utf-8')
})
const createApp = require('./dist/bundle.server.js')['default']


// 设置静态文件目录
express.use('/', exp.static(__dirname + '/dist'))


// 客户端打包地址
const clientBundleFileUrl = '/bundle.client.js'


// getHomeInfo请求
express.get('/api/getHomeInfo', (req, res) => {
    res.send('SSR发送请求')
})


// 响应路由请求
express.get('*', (req, res) => {
    const context = { url: req.url, title: 'Vue-ssr初探', meta:` <meta name="viewport" content="width=device-width, initial-scale=1" /> ` }

    // 创建vue实例，传入请求路由信息
    createApp(context).then(app => {
        let state = JSON.stringify(context.state)
        renderer.renderToString(app,context, (err, html) => {
            if (err) { return res.state(500).end('运行时错误') }
            res.send(html)
        })
    }, err => {
        if(err.code === 404) { res.status(404).end('所请求的页面不存在') }
    })
})


// 服务器监听地址
express.listen(8090, () => {
    console.log('服务器已启动！')
})
