gulp = node_modules/gulp/bin/gulp.js
PHONY: all
depend:
	npm install 
all: depend
	$(gulp)
test:
	$(gulp) test
serve: all
	npm start
clean:
	git clean -x -d -f --exclude=".aws-credentials.json"
clean-dry-run:
	git clean -x -d -n --exclude=".aws-credentials.json"
