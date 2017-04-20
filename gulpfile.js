var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    frontendWatch = [
        './apps/**/*.html',
        './apps/**/*.css',
        './apps/**/*.js'
    ];

gulp.task('sync', function() {
    browserSync.init({
        // 启动本地服务器
        server: {
            baseDir: './apps/'
        }
    });
    // 浏览器自动刷新（当静态文件和视图文件改变的时候）
    gulp.watch(frontendWatch).on('change', browserSync.reload);
});

// 默认任务
gulp.task('default', ['sync']);
