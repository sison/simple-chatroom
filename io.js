/*
 * @Author: sison.luo
 * @Date:   2019-09-03 14:32:24
 * @Last Modified by:   sison
 * @Last Modified time: 2020-09-09 18:18:12
 */


const _ = require('lodash')

module.exports = (server) => {
	const io = require("socket.io")(server, {
		// path: '/',
		// serveClient: false,
		// // below are engine.IO options
		// pingInterval: 10000,
		// pingTimeout: 5000,
		// cookie: false	
	})

	// const getUsersFromRID = (rooms, rid) => {
	// 	let roomusers = []
	// 	for (let i=0; i<rooms.length; i++) {
	// 		if (rooms[i].rid === rid) {
	// 			roomusers = rooms[i].users
	// 			return false
	// 		}
	// 	}
	// 	return roomusers
	// }

	let num = 0
	const createRoomID = () => {
		num++
		let dt = (new Date()).getTime()
		// console.log('roomID', `room_${dt}_${num}`)
		return `room_${dt}_${num}`
	}

	let initInfo = {
		avator: 'socket/images/avator/0.jpg',
		sex: 'male',
		xiu: 'xiu1',
		rooms: [],
		sign: '打工是不可能打工的，这辈子不可能打工的。做生意又不会，就是偷电动车，才能维持生活这样子。'
	}

	const robotReg = new RegExp(/^user.+/)


	let allNames = []
	let Robots = {
		user12345: {
			name: '窃·格瓦拉',
			avator: 'socket/images/avator/1.jpg',
			rooms: ['room_101']
		},
		user23456: {
			name: '特朗普',
			avator: 'socket/images/avator/2.jpg',
			rooms: ['room_101']
		},
		user34567: {
			name: '凤姐',
			avator: 'socket/images/avator/3.jpg',
			rooms: ['room_101']
		},
		user45678: {
			name: '爱因斯坦',
			avator: 'socket/images/avator/4.jpg',
			rooms: ['room_202']
		},
		user56789: {
			name: '牛顿',
			avator: 'socket/images/avator/5.jpg',
			rooms: ['room_202']
		},
		user67890: {
			name: 'Jack 马',
			avator: 'socket/images/avator/6.jpg',
			rooms: ['room_303']
		},
		user78901: {
			name: 'Pony 马',
			avator: 'socket/images/avator/6.jpg',
			rooms: ['room_303']
		},
		user89012: {
			name: 'Robin 李',
			avator: 'socket/images/avator/6.jpg',
			rooms: ['room_303']
		}
	}

	let Users = {}
	let Secrets = {
		room_303: '123'
	}
	let Rooms = {
		room_101: {
			name: '过气网红',
			avator: 'socket/images/room/star.jpg',
			users: {},
			owner: 'user12345'
		},
		room_202: {
			name: '广州租房',
			avator: 'socket/images/room/house.jpg',
			users: {},
			owner: 'user56789'
		},
		room_303: {
			name: '互联网大佬',
			avator: 'socket/images/room/talebase.jpg',
			isSecret: true,
			users: {},
			owner: 'user67890'
		}
	}

	// 机器人加入 Rooms ----？？
	// 机器人加入 allNames

	// 插入机器人
	let cpRobots = { ...Robots }
	Object.keys(cpRobots).forEach(v => {
		Rooms[cpRobots[v].rooms[0]].users[v] = cpRobots[v]
		allNames.push(cpRobots[v].name)
	})


	Rooms = {
		"room101": {
			users: {
				"user12345": {
					name: '窃·格瓦拉',
					avator: 'socket/images/avator/1.jpg',
					rooms: ['room_101']
				}
			}
		},
		"room102": {}
		"room103": {}
		...
	}

	// console.log('#####################################')
	// console.log('Rooms of insert robots：', Rooms)
	// console.log('#####################################')
	// console.log('allNames of insert robots：', allNames)
	// console.log('#####################################')



	io.on('connection', socket => {

		// console.log(socket.adapter.rooms)

		console.log('')
		console.log('************** somebody connected *************')
		console.log('')

		socket.on('set user', user => {
			if (_.indexOf(allNames, user.name) > -1) {
				socket.emit('name comflict', '名字已被使用，请重新输入')
				return
			}
			user.id = socket.id
			user.avator = user.avator || initInfo.avator
			user.rooms = []
			user.sex = user.sex || initInfo.sex
			user.xiu = user.xiu || initInfo.xiu
			user.sign = user.sign || initInfo.sign
			socket.emit('save me', user)
			allNames.push(user.name)
			socket.emit('show rooms', Rooms)

			Users[socket.id] = user

			// console.log('Users ============:')
			// console.log(Users)
			// console.log('Users ============:')

			// 加入房间
			socket.on('join room', roomID => {
				socket.join(roomID, () => { 
					// let users = getUsersFromRID(rooms, roomID)

					// console.log('Object.keys(socket.rooms)', Object.keys(socket.rooms))
					// console.log('--------------------------------------------------')
					// console.log('socket.handshake', socket.handshake)	// 握手信息
					// console.log('--------------------------------------------------')
					// console.log('--------------------------------------------------')

					// if (!Rooms[roomID]) {
					// 	socket.emit('notice', '没有该聊天室')
					// 	return
					// }

					let users = Rooms[roomID].users || {}
					users[socket.id] = {
						name: user.name,
						avator: user.avator
					}
					console.log('')
					console.log('===== ', user.name, ' 加入房间 ', roomID, ' =====')
					console.log('')

					if (!Users[socket.id]['rooms']) {
						Users[socket.id]['rooms'] = []
					}
					Users[socket.id]['rooms'].push(roomID)
					// Object.defineProperty(users, socket.id, {
					// 	value: '',
					// 	configurable: true,		// 可 delete
					// 	enumerable: true		// 可 Object.keys
					// })
					// users.push({
					// 	name,
					// 	userid: socket.id
					// })
					// io.emit('show rooms', Rooms)	// 实时更新
					socket.broadcast.to(roomID).emit('broadcast join room', {
						roomID,
						user,
						newcomeID: socket.id
					})
				})
			})



			socket.on('leave room', roomID => {
				socket.leave(roomID)
				console.log('')
				console.log('===== ', user.name, ' 离开房间 ', roomID, ' =====')
				console.log('')
				delete Rooms[roomID]['users'][socket.id]
				Users[socket.id]['rooms'] = _.difference(Users[socket.id]['rooms'], [roomID])
				io.emit('show rooms', Rooms)

				// 判断房间是否还有用户
				if (Object.keys(Rooms[roomID]['users']).length > 0) {
					socket.broadcast.to(roomID).emit('broadcast leave room', {
						user,
						roomID,
					})
				} else {
					delete Rooms[roomID]
				}
			})



			socket.on('disconnect', () => {

				console.log('')
				console.log('===== ', user.name, ' 掉线', ' =====')
				console.log('')
				allNames = _.difference(allNames, [user.name])
				if (Users[socket.id]['rooms'].length > 0) {
					Users[socket.id]['rooms'].forEach(rid => {
						// 遍历房间退出用户，逐个房间广播，代码跟leave 一样 --------
						socket.leave(rid)
						console.log('')
						console.log('===== ', user.name, ' 离开房间 ', rid, ' =====')
						console.log('')
						delete Rooms[rid]['users'][socket.id]
						Users[socket.id]['rooms'] = _.difference(Users[socket.id]['rooms'], [rid])
						// 判断房间是否还有用户
						if (Object.keys(Rooms[rid]['users']).length > 0) {
							socket.broadcast.to(rid).emit('broadcast leave room', {
								roomID: rid,
								user
							})
						} else {
							delete Rooms[rid]
						}
						// 遍历房间退出用户，代码跟leave 一样 --------
					})
				}
				setTimeout(() => {
					io.emit('show rooms', Rooms)
					delete Users[socket.id]
				}, 0)
			})


			// socket.on('get roomusers', roomID => {
			// 	socket.emit('get roomusers', {
			// 		roomID,
			// 		users: Rooms[roomID]['users'] || {}
			// 	})
			// })

			socket.on('get info', (type, id, render) => {
				let output = {}
				if (type === 'single') {
					if (robotReg.test(id)) {
						// robot
						output = initInfo
					} else {
						// people
						output = Users[id]
					}
				} else if (type === 'room') {
					output = Rooms[id]
				}
				output.id = id
				output.type = type
				output.render = render
				socket.emit('get info', output)
			})


			socket.on('new room', data => {
				const roomID = createRoomID()
				// const regSecret = /^[A-Za-z0-9\u4e00-\u9fa5]+$/
				let isSecret = false
				if (data.name === '') {
					socket.emit('message', '请输入群名称')
					return
				}
				if (data.secret && parseInt(data.switch) === 1) {
					if (data.secret === '') {
						socket.emit('message', '请输入邀请码')
						return
					}
					isSecret = true
					Secrets[roomID] = data.secret
				}
				// console.log('~~~~~~~~~~~~~~~')
				// console.log('房间', roomID, '：存到后台的secret是-----', data.secret)
				// console.log('~~~~~~~~~~~~~~~')
				Rooms[roomID] = {
					name: data.name,
					avator: data.avator || 'socket/images/room/room.jpg',
					isSecret,
					users: {},
					owner: user.id
				}
				console.log('************')
				console.log('after new room: ', Rooms[roomID])
				console.log('************')
				io.emit('new room', {
					roomID,
					name: Rooms[roomID].name,
					avator: Rooms[roomID].avator,
					isSecret
				})
			})


			socket.on('valid room secret', ({ secret, roomID, toName, toAvator }) => {
				// console.log('~~~~~~~~~~~~~~~')
				// console.log('房间', roomID, '接收验证的secret是-----', secret)
				// console.log('~~~~~~~~~~~~~~~')
				if (Secrets[roomID] === secret) {
					socket.emit('valid room secret', {
						roomID,
						toName,
						toAvator
					})
				} else {
					socket.emit('message', '邀请码错误，无法进入')
				}
			})


			socket.on('chat', (type, fromID, toID, txt) => {
				// console.log('后台接收 fromID：', fromID)
				// console.log('后台接收 toID：', toID)
				// io.of('/').emit( ... )	// 下面是简写，默认命名空间 /
				if (type === 'single') {
					if (robotReg.test(toID)) {
						// robot
						socket.emit('chat', {
							receiveID: toID,
							from: Robots[toID],
							txt: '出去抽跟烟，让自己冷静一下 <img src="socket/images/face/5.gif">',
							robot: true
						})
					} else {
						// people
						io.to(toID).emit('chat', {
							receiveID: fromID,
							from: Users[fromID],
							txt: encodeURIComponent(txt)
						})
					}
				} else if (type === 'room') {
					io.to(toID).emit('chat', {
						receiveID: toID,
						from: Users[fromID],
						txt: encodeURIComponent(txt),
						fromID
					})
				}
			})
		})

	})
}