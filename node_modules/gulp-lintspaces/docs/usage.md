## Usage

```javascript
var gulp = require("gulp");
var lintspaces = require("gulp-lintspaces");

gulp.task("YOURTASK", function() {
    return gulp.src("**/*.js")
        .pipe(lintspaces(/* options */))
        .pipe(lintspaces.reporter());
});
```
