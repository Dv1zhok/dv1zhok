var fileswatch   = 'html,htm,txt,json,md,woff2';

var gulp 		 	= require('gulp'),
gulpSass  		= require('gulp-sass'),
dartSass      = require('sass'),
sassglob    	= require('gulp-sass-glob'),
sass          = gulpSass(dartSass),
browserSync   = require('browser-sync'),
bssi   				= require('browsersync-ssi'),
ssi   				= require('ssi'),
postCss       = require('gulp-postcss'),
cssnano       = require('cssnano'),
concat        = require('gulp-concat'),
uglify        = require('gulp-uglify-es').default,
autoprefixer  = require('autoprefixer'),
del           = require('del');

// Local Server
function browsersync() {
	browserSync({
		server: {
			baseDir: 'app/',
			middleware: bssi({ baseDir: 'app/', ext: '.html' })
		},
		ghostMode: { clicks: false },
		notify: false,
		// online: true,
	})
}

// Styles
function styles() {
	return gulp.src(['app/styles/*.*', '!app/styles/_*.*'])
	.pipe(eval('sassglob')())
	.pipe(eval('sass')({ 'include css': true }))
	.pipe(postCss([
		autoprefixer({ grid: 'autoplace' }),
		cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
		]))
	.pipe(concat('app.min.css'))
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.stream())
}

// Scripts
function scripts() {
	return gulp.src([
		'app/libs/jquery/jquery-3.6.0.min.js',
		'app/libs/tooltipster/tooltipster.bundle.min.js',
		])
	.pipe(concat('libs.min.js'))
	// .pipe(uglify({ output: { comments: false } }))
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.stream())
}

//Copy
function buildcopy() {
	return gulp.src([
		'{app/js,app/css}/**/*.*',
		'app/img/**/*.*',
		'app/libs/**/*.*',
		'app/fonts/**/*'
		], {base: 'app/'})
	.pipe(gulp.dest('dist'))
}

async function buildhtml() {
	let includes = new ssi('app/', 'dist/', '/**/*.html')
	includes.compile()
	del('dist/parts', {force: true})
}

async function cleandist() {
	del('dist/**/*', {force: true})
}

//Watch
function startwatch() {
	gulp.watch('app/styles/**/*', { usePolling: true }, styles)
	gulp.watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
	gulp.watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browserSync.reload)
}

gulp.task('build', gulp.series(cleandist, scripts, styles, buildcopy, buildhtml));
gulp.task('default', gulp.series(scripts, styles, gulp.parallel(browsersync, startwatch)));
