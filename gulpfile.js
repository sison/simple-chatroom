/*
 * @Author: sison.luo
 * @Date:   2019-09-03 17:25:20
 * @Last Modified by:   sison.luo
 * @Last Modified time: 2019-09-03 23:01:21
 */

const { task, series, parallel, src, dest, watch } = require('gulp')
const gulp = require('gulp')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const through = require('through2')



// 将文件里面的中文转 unicode
const replaceCncode = function (file, enc, cb) {
	if (file.isNull()) {
		this.push(file)
		return cb(null ,file)
	}
	if (file.isStream()) {
		console.log('不支持 Streaming')
		return cb(null, file)
	}
	file.contents = Buffer.from(String(file.contents).replace(/[\u4e00-\u9fa5]/g, match => '\\u' + match.charCodeAt(0).toString(16)))
	this.push(file)
	return cb(null, file)
}



const babelJS =  next => {
	return src('./public/socket/socket.js')
		.pipe(rename({ suffix: '.min' }))
		.pipe(babel({presets: ['@babel/env']}))
		.pipe(dest('./public/socket'))
	next()
}

const compressJS = next => {
	return src('./public/socket/socket.min.js')
		.pipe(uglify())
		.pipe(dest('./public/socket'))
	next()
}

const uniCode = next => {
	return src('./public/socket/socket.min.js')
		.pipe(through.obj(replaceCncode))
		.pipe(dest('./public/socket'))
	next()
}

exports.default = series(babelJS, compressJS, uniCode)




