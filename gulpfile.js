var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var clean = require("gulp-clean");
var taskListing = require("gulp-task-listing");
var template = require("gulp-template");
var rename = require('gulp-rename');
var del = require("del");
var fs = require("fs");
var util = require("./en-cn.js");
var runTimestamp = Math.round(Date.now() / 1000);

// 发布项目
var filt = null,
    task = {
        // 发布打包
        iconfont: function(name) {
            return gulp.src('./src/icons/' + name + '/' + name + '.svg')
                .pipe(rename(function(path) {
                    path.basename = util.getPym(path.basename, true);
                }))
                .pipe(iconfontCss({
                    fontName: this.icons(name),
                    path: './src/templates/iconfont.css',
                    targetPath: '../css/iconfont.css',
                    fontPath: 'https://mstatic.secooimg.com/secoo-icon-font/' + name + '/fonts/' + name
                }))
                .pipe(iconfont({
                    fontName: name,
                    formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
                    normalize: true,
                    fixedWidth: false,
                    centerHorizontally: true,
                    fixedWidth: true,
                    fontHeight: 1024,
                    fontStyle: 'normal',
                    descent: 6.25,
                    options: {
                        fixedWidth: false,
                        centerHorizontally: true,
                        fixedWidth: true,
                        fontHeight: 1024,
                        fontStyle: 'normal',
                        descent: 6.25
                    },
                    // prependUnicode: true // 会修改掉svg的名字
                    timestamp: runTimestamp,
                }))
                .on('glyphs', function(glyphs, options) {})
                .pipe(gulp.dest('./build/' + name + '/fonts/'));
        },
        example: function(name) {

            //console.log(this.icons(name));
            return gulp.src('./src/example/index.html')
                .pipe(template({
                    icons: this.icons(name),
                    pathnames: filt
                }))
                .pipe(gulp.dest("./build/" + name + "/example"));
        },
        clean: function(name) {
            var icons = this.icons(name);
            return gulp.src("./build/" + name, {
                read: false
            }).pipe(clean());
        },
        icons: function(name) {
            var icons = fs.readdirSync('./src/icons/' + name);
            icons = icons.map(function(icon) {
                return util.getPym(icon.replace(/\.\w+$/, ''), true);
            });
            return icons;
        }
    },
    taskMerge = {
        // 发布打包
        iconfont: function(name) {
            return gulp.src('./src/merge-svg/*.svg')
                .pipe(rename(function(path) {
                    path.basename = util.getPym(path.basename, true);
                }))
                .pipe(iconfontCss({
                    fontName: 'merge',
                    path: './src/templates/iconfont.css',
                    targetPath: '../css/iconfont.css',
                    fontPath: 'https://mstatic.secooimg.com/secoo-icon-font/merge/fonts/merge'
                }))
                .pipe(iconfont({
                    fontName: 'merge',
                    formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
                    normalize: true,
                    fixedWidth: false,
                    centerHorizontally: true,
                    fixedWidth: true,
                    fontHeight: 1024,
                    fontStyle: 'normal',
                    descent: 6.25,
                    options: {
                        fixedWidth: false,
                        centerHorizontally: true,
                        fixedWidth: true,
                        fontHeight: 1024,
                        fontStyle: 'normal',
                        descent: 6.25
                    },
                    // prependUnicode: true // 会修改掉svg的名字
                    timestamp: runTimestamp,
                }))
                .on('glyphs', function(glyphs, options) {})
                .pipe(gulp.dest('./finally/merge/fonts/'));
        },
        example: function(name) {

            //console.log(this.icons(name));
            return gulp.src('./src/example/index.html')
                .pipe(template({
                    icons: this.icons(name),
                    pathnames: filt
                }))
                .pipe(gulp.dest("./finally/merge/example"));
        },
        clean: function(name) {
            var icons = this.icons(name);
            return gulp.src("./finally/merge", {
                read: false
            }).pipe(clean());
        },
        icons: function(name) {
            var icons = fs.readdirSync('./src/merge-svg');
            icons = icons.map(function(icon) {
                return util.getPym(icon.replace(/\.\w+$/, ''), true);
            });
            return icons;
        }
    };
// 读取文件

function read() {
    return new Promise((res, rej) => {
        let list = fs.readdirSync('./src/icons');
        res(list)
    })
}
async function mkdir() {
    let reads = await read();
    return reads
}
gulp.task("del", function() {
    return del(['./build/*']);
});
gulp.task("delmerge", function() {
    return del(['./finally/*']);
})
gulp.task("list", function() {
    mkdir().then(r => {
        filt = r;
        console.log(r);
    }).catch(e => {
        console.log(e);
        filt = []
    })
});
gulp.task("svgdir", function() {
    filt = fs.readdirSync('./src/merge-svg').map((item) => {
        return item.split('.')[0]
    });
});
// 分开打包
gulp.task('default', ["del", "list"], function() {
    for (var key in task) {
        if (key != "icons") {
            for (var key2 in filt) {
                task[key](filt[key2]);
            }
        }
    }
});

// 合并打包
gulp.task('merge', ["delmerge", "svgdir"], function() {
    for (var key in taskMerge) {
        if (key != "icons") {
            for (var key2 in filt) {
                taskMerge[key](filt[key2]);
            }
        }
    }
});