gulp = node_modules/gulp/bin/gulp.js
PHONY: all
depend:
	npm install 
all: depend
	$(gulp)
test:
	$(gulp) test