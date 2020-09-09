/*
* @Author: sison.luo
* @Date:   2019-07-28 17:41:46
* @Last Modified by:   sison.luo
* @Last Modified time: 2020-09-09 16:12:23
*/

const express = require("express")
const http = require("http")
const path = require('path')
const cors = require('cors')
const app = express()
const server = http.createServer(app)
// const cluster = require('cluster')
// const cpuNum = require('os').cpus().length

require('./io.js')(server)

app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res, next) => {

	res.sendFile(path.join(__dirname, 'views/index.html'))
	// res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8' })
	// res.write('我是首页');
	// res.end();
})

app.use(cors({
    origin: ['*'],
    methods: ['post', 'get'],
    allowedHeaders: ['Content-Type', 'Authorization', 'application/x-font-truetype']
}))

// app.get('/chat', (req, res, next) => {
// 	res.sendFile(path.join(__dirname, 'views/socket/index.html'))
// })

// if (cluster.isMaster) {
// 	console.log(cpuNum)
// 	for (let i=0; i< cpuNum; i++) {
// 		cluster.fork()
// 	}
// 	cluster.on('exit', (worker, code, signal) => {
// 		console.log('worker ' + worker.process.pid + 'died')
// 	})
// } else {
	server.listen(7777, () => {
		console.log('server is listening 7777 port')
	})	
// }