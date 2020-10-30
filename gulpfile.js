var gulp = require('gulp');
var plumber = require('gulp-plumber');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
const purgecss = require('gulp-purgecss');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
var reload      = browserSync.reload;
var inject = require('gulp-inject');
// Configuration file to keep your code DRY
var cfg = require( './gulpconfig.json' );
var paths = cfg.paths;

sass.compiler = require('node-sass');

gulp.task('dist-assets', function (done) {
    gulp.src('./src/js/**.*')
        .pipe(gulp.dest('./dev/js'));
    gulp.src('./src/img/**.*')
        .pipe(gulp.dest('./dev/img'));
      done();
});

gulp.task('prod-copy', function (done) {
    gulp.src('./dev/**/**.*')
    .pipe(gulp.dest('./prod/'));
    done();
});

gulp.task('minify-css', () => {
  return gulp
    .src('dev/css/*.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe( rename( { suffix: '.min' } ) )
    .pipe(gulp.dest('dev/css'))
    .pipe(browserSync.stream());
});

// minifies HTML
gulp.task('minify-html', () => {
  return gulp.src('prod/*.html')
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest('prod'));
});


// Purging unused CSS
gulp.task('purgecss', () => {
    return gulp.src('prod/css/theme.min.css')
        .pipe(purgecss({
            content: ['prod/**/*.html']
        }))
        .pipe(gulp.dest('prod/css'))
})

gulp.task('clean-dist', function() {
  return gulp.src('dist', {
      read: false
    })
    .on('error', function(err) {
      console.log(err.toString());

      this.emit('end');
    })
    .pipe(clean());
});

gulp.task('clean', function() {
  return gulp.src('dev/scss', {
      read: false
    })
    .on('error', function(err) {
      console.log(err.toString());

      this.emit('end');
    })
    .pipe(clean());
});

// Compile sass to css
gulp.task('sass', function () {
  return gulp.src('src/scss/theme.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dev/css'))
    .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('browser-sync', gulp.series('sass', function(){

    browserSync.init({
        server: "./dev"
    });
    gulp.watch("./dev/*.html").on('change', browserSync.reload);
    gulp.watch("./dev/css/*.css").on('change', browserSync.reload);
    gulp.watch("*.html").on("change", reload);
}));

// Inject non-minified css link into HTML - for dev
gulp.task('inject-css', function (done) {
  gulp.src('./dev/index.html')
    .pipe(inject(gulp.src('./dev/css/theme.css', {read: false}), {relative: true}))
    .pipe(gulp.dest('./dev'));
     done();
});

// Inject minified css link into HTML - for prod
gulp.task('inject-min-css', function (done) {
  gulp.src('./prod/**/*.html')
    .pipe(inject(gulp.src('./prod/css/theme.min.css', {read: false}), {relative: true}))
    .pipe(gulp.dest('./prod'));
     done();
});




////////////////// All Bootstrap SASS  Assets /////////////////////////
gulp.task( 'copy-assets', function( done ) {
	////////////////// All Bootstrap 4 Assets /////////////////////////
	// Copy all JS files
	var stream = gulp
		.src( paths.node + '/bootstrap/dev/js/**/*.js' )
		.pipe( gulp.dest( paths.dev + '/js' ) );

	// Copy all Bootstrap SCSS files
	gulp
		.src( paths.node + '/bootstrap/scss/**/*.scss' )
		.pipe( gulp.dest( paths.dev + '/scss/assets/bootstrap' ) );

	////////////////// End Bootstrap 4 Assets /////////////////////////

	done();
} );