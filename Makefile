gulp = node_modules/gulp/bin/gulp.js --harmony
PHONY: all
depend:
	npm install 
all: depend
	$(gulp)
test: depend
	$(gulp) test
serve: all
	npm start
clean:
	git clean -x -d -f --exclude=".credentials"
clean-dry-run:
	git clean -x -d -n --exclude=".credentials"
publish: 
	$(gulp) publish
