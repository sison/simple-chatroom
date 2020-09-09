/*
* @Author: sison.luo
* @Date:   2019-09-03 17:20:26
* @Last Modified by:   sison.luo
* @Last Modified time: 2019-09-22 21:50:43
*/

// const socket = io('https://www.benbenla.com', { path: '/chat/socket.io/'})
const socket = io()
let roomID =null
let me = {}
let hasChater = false
let pIdx = 0
let runIDs = []
let tempSingle = {}
let tempRoom = {}
const audioMsgCome = new Audio('socket/mp3/didi.mp3')
const audioJoinRoom = new Audio('socket/mp3/joinroom.mp3')
const typeFacimg = [
	'1.jpg',
	'2.jpg',
	'3.jpg',
	'4.jpg',
	'5.gif',
	'6.jpg',
	'7.jpg',
	'8.gif',
	'9.jpg',
	'10.gif'
]
const createChatContent = (name, avator, txt, myself) => {
	let _html = ''
	_html +='<li class="clearfix '+ (myself ? "myself" : "") +'">'
		_html +='<img src="'+ avator +'" />'
		_html +='<span>'+ htmlEncode(name) +'</span>'
		_html +='<div class="clearfix">'
		_html +='<div class="chat-str">'+ txt +'</div>'
		_html +='</div>'
	_html +='</li>'
	return _html
}

const createEmoji = () => {
	let _html = ''
	_html += '<div>'
	for (let i =1; i<=50; i++) {
		_html += '<a><img src="socket/images/face/'+ i +'.gif" /></a>'
	}
	_html += '</div>'
	return _html
}
const createFacimg = () => {
	let _html = ''
	_html += '<div>'
	for (let i=0; i<typeFacimg.length; i++) {
		_html += '<a><img src="socket/images/facimg/'+ typeFacimg[i] +'" /></a>'
	}
	_html += '</div>'
	return _html
}
const getDivCont = div => {
	let output = div.get(0).innerHTML
	// if (div.textContent != null) {
	// 	div.textContent = output
	// } else {
	// 	div.innerText = output
	// }
	// output
	// 	.replace(/\r|\n/g, '<br />')
	// 	.replace(/\t/g, '&nbsp;&nbsp;')
	// 	.replace(/"/g, '\"');
	return output
}
const htmlEncode = html => {
	let dom = document.createElement('div')
	if (dom.textContent != null) {
		dom.textContent = html
	} else {
		dom.innerText = html
	}
	const output = decodeURIComponent(dom.innerHTML)
		// .replace(/\r|\n/g, '<br />')
		// .replace(/\t/g, '&nbsp;&nbsp;')
		// .replace(/"/g, '\"');
	return output
}
const addChatHead = (type, id, name, avator, click) => {
	let _html = ''
	_html += '<li>'
	_html += '<img src="'+ avator +'" />'
	_html += '<b class="ellipsis">'+ htmlEncode(name) +'</b>'
	_html += '<i>0</i>'
	_html += '<span id="'+ id +'"></span>'
	_html += '</li>'
	$('.chater .tab-head ul').append(_html)
	if (click) {
		$('.chater .tab-head ul li:last-child').click()
	}
}
const addChatone = (type, sendid) => {
	let _html = ''
	_html += '<div class="tab-one">'
		_html += '<div class="tab-flex">'
			_html += '<div class="chat-mid">'
				_html += '<div class="chat-content">'
					_html += '<ul>'
					_html += '</ul>'
				_html += '</div>'
				_html += '<div class="chat-input">'
					_html += '<div class="chat-fun">'
						_html += '<ul class="clearfix">'
							_html += '<li><i class="icon-smile"></i><input type="checkbox" /></li>'
							_html += '<li><i class="icon-facimg"></i><input type="checkbox" /></li>'
							_html += '<li><i class="icon-scissors"></i><input type="checkbox" /></li>'
							_html += '<li><i class="icon-music"></i><input type="checkbox" />'
								_html += '<div class="media-form"><p>发送音乐</p><input type="text" class="txt" name="source" datatype="music" placeholder="mp3网络地址" /><button class="icon icon-send"></button></div>'
							_html +='</li>'
							_html += '<li><i class="icon-image"></i><input type="checkbox" />'
								_html += '<div class="media-form"><p>发送图片</p><input type="text" class="txt" name="source" datatype="image" placeholder="图片地址" /><button class="icon icon-send"></button></div>'
							_html += '</li>'
							_html += '<li><i class="icon-film"></i><input type="checkbox" />'
								_html += '<div class="media-form"><p>发送视频</p><input type="text" class="txt" name="source" datatype="video" placeholder="视频网络地址" /><button class="icon icon-send"></button></div>'
							_html += '</li>'
						_html += '</ul>'
					_html += '</div>'
					_html += '<form class="sendMsgForm">'
						_html += '<div class="input-wrapper">'
							_html += '<div contenteditable="true" sendtype="'+ type +'" sendid="'+ sendid +'" class="textarea"></div>'
							_html += '<button type="submit">SEND</button>'
						_html += '</div>'
					_html += '</form>'
				_html += '</div>'
			_html += '</div>'
			_html += '<div class="chat-users">'
			_html += '</div>'
		_html += '</div>'
	_html += '</div>'
	$('.chater .tab-body').append(_html)
	const tabone = $('.chater .tab-body .tab-one:last-child')
	// tabone.find('.chat-content').mCustomScrollbar({
	// 	axis: 'y',
	// 	autoHideScrollbar: true,
	// 	scrollInertia: 0,
	// 	advanced:{ updateOnContentResize: true }
	// })


	tabone.find('.chat-fun ul li').on('click', function () {
		$(this).siblings('li').find('input[type="checkbox"]').prop('checked', false)

		if (!$(this).children('div').length) {
			if ($(this).index() === 0) {
				$(this).append(createEmoji())
			} else if ($(this).index() === 1) {
				$(this).append(createFacimg())
			}
		}
	})
	tabone.on('click', '.chat-fun ul li:eq(0) > div a', function () {
		const textarea = $(this).closest('.chat-mid').find('div.textarea').get(0)
		// 如果输入框是 textarea 的话
		// const pos = cursorRange.get(textarea)
		// cursorRange.add(textarea, pos, faceStr)
		textarea.focus()
		const emoji = $(this).clone(true).html()
		const selection = window.getSelection()
		// if (IE) {
		// } else {
			document.execCommand('insertHTML', false, emoji)
			// chrome 已经废弃 selection.addRange() 方法
			// 删除选中内容，插入新内容
			// selection.deleteFromDocument()
			// const startOffset = range.startOffset
			// let range = selection.getRangeAt(0)
			// let range = document.createRange()
			// range.selectNode(emoji)
			// range.selectNode(document.getElementsByTagName('p')[0])
			// range.collapse(true)
			// selection.removeAllRanges()
			// selection.addRange(range)
		// }
		$(this).parent().prev('input').prop('checked', false)
	})
	tabone.on('click', '.chat-fun ul li:eq(1) > div a', function () {
		const txt = $(this).clone().html()
		$(this).parent().prev('input').prop('checked', false)
		submitChat(txt, $(this))
	})
	tabone.on('keyup', '.chat-fun ul li input[type="text"]', function (e) {
		const _this = $(this)
		if (e.keyCode === 13) {
			const path = _this.val()
			const type = _this.attr('datatype')
			let txt = ''
			switch (type) {
				case 'music':
					txt += '<audio src="'+ path +'" controls="controls">您的浏览器不支持 audio 标签</audio>'
					break;
				case 'image':
					txt += '<img src="'+ path +'" />'
					break;
				case 'video':
					// txt += '<div class="pre-video" data-path="'+ path +'"><i class="icon icon-play"></i></div>'
					txt += '<video src="'+ path +'" controls="controls">您的浏览器不支持 video 标签</video>'
					break;
			}
			submitChat(txt, _this, function () {
				_this.val('')
				_this.parent().prev('input').prop('checked', false)
			})
		}
	})
}
const addChatMsg = (type, idx, data) => {
	let _html = ''
	switch (type) {
		case 'datetime':
			break
		case 'broadcast':
			let msg = htmlEncode(data.name) + ' ' + (data.type === 'join' ? '进入聊天室' : '离开聊天室')
			_html += '<li class="broadcast">'+ msg +'</li>'
			break
		case 'content':
			const myself = data.fromID === me.id
			_html = createChatContent(data.from.name, data.from.avator, data.txt, myself)
			// $('#chat'+ receiveID +' .chat-content ul').append(_html)
			break
	}
	$('.chater .tab-body .tab-one:eq('+ idx +') .chat-content ul').append(_html)
	// if (判断_html是否有 <img />)
	setTimeout(() => {
		const ul = $('.chater .tab-body .tab-one:eq('+ idx +') .chat-content ul')
		ul.scrollTop(ul.get(0).scrollHeight)
	},100)
}
const getSideInfo = (type, info) => {
	let _html = ''
	_html += '<div>'
		if (type === 'single') {
			_html += '<div><img src="socket/images/'+ info.xiu +'.jpg" /></div>'
			_html += '<h6>个性签名</h6>'
			_html += '<p>'+ info.sign +'</p>'
		} else {
			_html += '<ul>'
				Object.keys(info.users).forEach(v => {
					const name = htmlEncode(info.users[v]['name'])
					const avator = info.users[v]['avator']
					const owner = info.owner === v ? '<i class="icon icon-single" title="群主"></i>' : ''
					_html += '<li userid="'+ v +'"><img src="'+ avator +'" /><span>'+ name +'</span>'+ owner +'</li>'
				})
			_html += '</ul>'
		}
	_html += '</div>'
	$('.chater .tab-one:last-child .chat-users').append(_html)
}
const createChater = () => {	// 	(type, roomID) => {}
	if (hasChater) return;
	hasChater = true
	let _html = ''
	// _html += '<div class="chater" id="chat'+ roomID +'">'
	_html += '<div class="chater">'
	_html += '<div class="chat-bar">'
	_html += '<p><img src="'+ me.avator +'" /> <b>'+ htmlEncode(me.name) +'</b></p>'
	// _html += '<span class="fr icon icon-close" roomid="'+ roomID +'"></span>'
	_html += '<span class="fr icon icon-close"></span>'
	_html += '</div>'
	_html += '<div class="chat-main">'
	_html += '<div class="tab">'
	_html += '<div class="tab-head">'
	_html += '<ul></ul>'
	_html += '</div>'
	_html += '<div class="tab-body">'
	_html += '</div>'
	_html += '</div>'
	_html += '</div>'
	_html += '</div>'
	$('body').append(_html)
}
const newChatPanel = (type, toID, toName, toAvator) => {
	runIDs.push(toID)
	if (type === 'room') socket.emit('join room', toID);
	createChater()
	addChatone(type, toID)
	addChatHead(type, toID, toName, toAvator, true)
	socket.emit('get info', type, toID, true)
}
const submitChat = (txt, target, callback) => {
	const sendid = runIDs[pIdx]
	const reg = new RegExp(/^room_.+/)
	const type = reg.test(sendid) ? 'room' : 'single'
	if (type === 'single') {
		target.closest('.chat-mid').find('.chat-content ul').append(createChatContent(me.name, me.avator, txt, true))
		setTimeout(() => {
			const ul = target.closest('.chat-mid').find('.chat-content ul')
			ul.scrollTop(ul.get(0).scrollHeight)
		},100)
	}
	socket.emit('chat', type, me.id, sendid, txt)
	if (typeof(callback) === 'function') callback()
	return false
}


$(() => {

	$('body').on('keyup', 'div.textarea', function (e) {
		if (e.ctrlKey && e.keyCode === 13) {
			const _this = $(this)
			if (_this.get(0).hasChildNodes()) {
				// const sendid = $(this).attr('sendid')
				const txt = getDivCont($(this))
				submitChat(txt, _this, () => {
					_this.empty()
				})
			}
		}
	})

	$('body').on('click', '.chater .tab-head li', function (e) {
		if (!$(this).hasClass('cur')) {
			$(this).addClass('cur').siblings('li').removeClass('cur')
			$(this).find('i').removeClass('vis').text(0)
			const _idx = $(this).index()
			pIdx = _idx
			$('.chater .tab-body .tab-one').eq(_idx).addClass('cur').siblings('.tab-one').removeClass('cur')
		}
	})

	$('#rooms').on('click', 'ul.roomlist li a', function() {
		const roomID = $(this).attr('roomid')
		const idx = _.indexOf(runIDs, roomID)
		const toName = $(this).find('p').text()
		const toAvator = $(this).find('img').attr('src')
		if (idx > -1) {
			$('.chater .tab-head li').eq(idx).click()
			return
		}
		if ($(this).hasClass('secret')) {
			ceng.hello({
				title: '聊天室邀请码',
				content: $("#divRoomSecret"),
				contentType: 'dom',
				area: [480, 240],
				complete (o, i) {
					var validor = new Valid();
					var form = $('#formRoomSecret')
					validor.form(form, {
						isAsync: true,
						asyncFun () {
							socket.emit('valid room secret', {
								secret: o.find('#iptSecret').val(),
								roomID,
								toName,
								toAvator
							})
							ceng.close(i)
						},
						errFun () {
							o.find('.ceng-btn .btn').removeClass('disabled')
						}
					})
				},
				yes: function (o, i) {
					// $('#iptSecret').val($.trim($('#iptSecret').val()))
					$('#formRoomSecret').submit()
				}
			})
		} else {
			newChatPanel('room', roomID, toName, toAvator)
		}
	})

	$('body').on('click', '.chater .chat-users ul li', function () {
		const userID = $(this).attr('userid')
		const idx = _.indexOf(runIDs, userID)
		if (userID === me.id) {
			ceng.alert('点击自己弹出个人信息面板')
			return
		}
		if (idx > -1) {
			$('.chater .tab-head li').eq(idx).click()
			return
		}
		const toName = $(this).find('span').text()
		const toAvator = $(this).find('img').attr('src')
		newChatPanel('single', userID, toName, toAvator)
	})

	$('#setNameForm').on('submit', e => {
		e.preventDefault()
		socket.emit('set user', { 
			name: $('#iptName').val()
		})
		$('#iptName').val('')
		return false
	})

	$('#rooms .panel #addRoom').on('click', () => {
		ceng.hello({
			title: '创建群组',
			content: $('#divNewRoom'),
			contentType: 'dom',
			area: [480, 380],
			complete (o, i) {
				var validor = new Valid();
				var form = $('#formNewRoom')
				validor.form(form, {
					isAsync: true,
					asyncFun () {
						var data = {}
						data.name = form.find('input[name="name"]').val()
						data.switch = form.find('input[name="switch"]').val()
						data.secret = form.find('input[name="secret"]').val()
						// form.serialize() 系列化会编码数据，导致校验失败
						// form.serialize().split('&').forEach(v => {
						// 	data[v.split('=')[0]] = decodeURIComponent(v.split('=')[1])
						// })
						socket.emit('new room', data)
						ceng.close(i)
					},
					errFun () {
						o.find('.ceng-btn .btn').removeClass('disabled')
					}
				});
				o.find('#switchCode').switchSmart({
					enable () {
						$('#rowSecret').addClass('slide required')
						$('#roomSecret').addClass('txt').attr('data-req', true)
					},
					disable () {
						$('#rowSecret').removeClass('slide required')
						$('#roomSecret').val('').removeClass('txt').attr('data-req', false)
					}
				})
			},
			yes (o, i) {
				// $('#roomSecret').val($.trim($('#roomSecret').val()))
				$('#formNewRoom').submit()
			}

		})
	})

	$('#formSearch input')
		.on('focus', () => {
			$('.panel-search').addClass('focus')
		})
		.on('blur', () => {
			$('.panel-search').removeClass('focus')
		})

	$('body').on('click', '.icon-close', function () {
	})

	$('#rooms i.nail').on('click', () => {
		$('#rooms').toggleClass('faint')
	})
})

socket.on('name comflict', msg => {
	ceng.msger(msg, 0)
})

socket.on('save me', user => {
	me = user
	$('#setname').fadeOut('250')
	$('#shadow').fadeOut('250')
	$('#myInfo img').attr('src', user.avator)
	$('#myInfo span').text(user.name)
	$('#myInfo p').text(user.sign)
})

socket.on('show rooms', rooms => {
	let _html = ''
	// rooms = rooms
	Object.keys(rooms).forEach((v, i) => {
		_html += '<li>'
		_html += '<a class="clearfix '+ (rooms[v].isSecret ? "secret" : "") +'" roomid="'+ v +'">'
		_html += '<i class="icon icon-lock-closed"></i>'
		_html += '<img src="'+ rooms[v].avator +'" />'
		_html += '<p class="ellipsis">'+ htmlEncode(rooms[v].name) +'</p>'
		_html += '<span class="ellipsis">ID：' + v +'</span>'
		_html += '</a>'
		_html += '</li>'
	})
	$('#rooms').toggleClass('empty', Object.keys(rooms).length < 1)
	$('#rooms ul.roomlist').empty().append(_html)
})

socket.on('message', msg => {
	ceng.msger(msg, 0)
})

socket.on('get info', info => {
	let _html = ''
	if (info.type === 'single') {
		if (info.render) getSideInfo('single', info)
	} else if (info.type === 'room') {
		if (info.render) getSideInfo('room', info)
	}
})

socket.on('valid room secret', ({roomID, toName, toAvator}) => {
	newChatPanel('room', roomID, toName, toAvator)
})

socket.on('new room', ({roomID, name, avator, isSecret}) => {
	let _html = ''
	_html += '<li>'
	_html += '<a class="clearfix '+ (isSecret ? "secret" : "") +'" roomid="'+ roomID+'">'
	_html += '<i class="icon icon-lock-closed"></i>'
	_html += '<img src="'+ avator +'">'
	_html += '<p class="ellipsis">'+ htmlEncode(decodeURIComponent(name)) +'</p>'
	_html += '<span class="ellipsis">ID：'+ roomID +'</span>'
	_html += '</a>'
	_html += '</li>'
	$('#rooms .panel .roomlist').append(_html)
})

socket.on('broadcast join room', ({roomID, user, newcomeID}) => {
	const _idx = _.indexOf(runIDs, roomID)
	addChatMsg('broadcast', _idx, {
		type: 'join',
		name: user.name
	})
	audioJoinRoom.play()
	$('.chater .tab-one:eq('+ _idx +') .chat-users ul').append('<li userid="'+ newcomeID +'"><img src="'+ user.avator +'" /><span>'+ htmlEncode(user.name) +'</span></li>')
})

socket.on('broadcast leave room', ({roomID, user}) => {
	const _idx = _.indexOf(runIDs, roomID)
	addChatMsg('broadcast', _idx, {
		type: 'leave',
		name: user.name
	})
	$('.chater .chat-users ul li').each(function () {
		if ($(this).find('span').text() === user.name) {
			$(this).remove()
		}
	})
})

socket.on('chat', ({receiveID, from, txt, fromID}) => {
	let _idx = _.indexOf(runIDs, receiveID)
	if (_idx === -1) {
		createChater()
		runIDs.push(receiveID)
		addChatone('single', receiveID)
		addChatHead('single', receiveID, from.name, from.avator)
		_idx = runIDs.length - 1
		socket.emit('get info', 'single', receiveID, true)
	}
	if (hasChater && pIdx != _idx) {
		const $iDom = $('.chater .tab-head li').eq(_idx).find('i')
		let unRead = parseInt($iDom.text());
		$iDom.addClass('vis').text(parseInt($iDom.text()) + 1)
	}
	if (me.id != fromID) audioMsgCome.play()
	addChatMsg('content', _idx, {
		fromID,
		from,
		txt: decodeURIComponent(txt)
	})
})
