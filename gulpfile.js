var gulp =require('gulp'),
    fileinclude=require('gulp-file-include'),
    clean = require('gulp-clean'),
    concat=require('gulp-concat'),
    cssmin=require('gulp-cssmin'),
    connect=require('gulp-connect'),
    gulpopen=require('gulp-open'),
    os=require('os')
host = {
    path:'dist/',
    port:3090,
    index:'index.html'
}
    
   

var browser =os.platform() === 'linux'? 'google-chrome':(
        os.platform() === 'darwin'? 'google chrome':(
                os.platform() === 'win32' ? 'chrome' :'chrome'
            )
    ) 
var browserSync =require ('browser-sync').create()
    /*文档公共模块处理*/
    //合并html
gulp.task('fileinclude',function(done){
    gulp.src('src/view/*.html')
        .pipe(fileinclude({
            prefix:'@@',
            basepath:'@file'
        }))
        .pipe(gulp.dest('dist/views'))
        .on('end',done)
})

//清除inc文件
gulp.task('clean',function(done){
    gulp.src(['dist'])
    .pipe(clean())
    .on('end',done)
})

//合并压缩css代码
gulp.task('cssmin',function(done){
    gulp.src(['src/css/*.css'])
    .pipe(concat('style.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'))
    .on('end',done)
})

//拷贝图片
gulp.task('copy-images',function(done){
    gulp.src(['src/img/*'])
    .pipe(gulp.dest('dist/img'))
    .on('end',done)
})

//运行web服务器
gulp.task('connect',function(){
    console.log('连接中.......')
    connect.server({
        root:host.path,
        port:host.port,
        livereload:true
    })
})

//自动打开浏览器
gulp.task('open',function(done){
    gulp.src('')
        .pipe(gulpopen({
            app:browser,
            uri:'http://localhost:3090/views/'+host.index
        }))
        .on('end',done)
})

//监控文件变化
gulp.task('watch',function(done){
    gulp.watch('src/**/**',['cssmin','fileinclude',browserSync.reload])
        .on('end',done)
})

//任务组装

gulp.task('dev',['fileinclude','cssmin','copy-images','connect','watch','open'])