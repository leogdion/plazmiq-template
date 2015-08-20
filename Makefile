gulp = node_modules/gulp/bin/gulp.js --harmony
static = node_modules/node-static/bin/cli.js 
PHONY: all
depend:
	npm install 
all: depend
	$(gulp) ${task}
test: depend
	$(gulp) test
serve: all
	$(static) build/production -p 8080 & npm start
clean:
	git clean -x -d -f --exclude=".credentials"
clean-dry-run:
	git clean -x -d -n --exclude=".credentials"
publish: 
	$(gulp) publish
dev-serve: all
	$(static) build/development -p 8081 & npm start 
