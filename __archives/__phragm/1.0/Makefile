gulp = node_modules/gulp/bin/gulp.js --harmony
static = node_modules/node-static/bin/cli.js 
PHONY: all
depend:
	npm install 
all: depend
	$(gulp) ${task}
test: depend
	$(gulp) test
prod: all
	$(static) build/production -p 8080 & npm start
clean:
	git clean -x -d -f --exclude=".credentials"
clean-dry-run:
<<<<<<< HEAD:Makefile
	git clean -x -d -n --exclude=".credentials"
=======
	git clean -x -d -n --exclude=".aws-credentials.json"
depend:
	npm install 
development: depend
	gulp development
production: depend
	gulp production
kill-serve:
	-nohup pgrep -f 'node node_modules/node-static/bin/cli.js' | xargs kill
serve-development: kill-serve development
	node_modules/node-static/bin/cli.js build/development -p 8081 & NODE_ENV=development node app
serve-test: kill-serve
	node_modules/node-static/bin/cli.js build/production -p 8080 & NODE_ENV=test node app
serve: kill-serve all serve-development serve-test
watch: depend
	gulp watch
serve-watch: serve watch
>>>>>>> phragm:__phragm/1.0/Makefile
publish: 
	$(gulp) publish
dev: all
	$(static) build/development -p 8081 & npm start 
serve: all
	$(static) build/production -p 8080 & $(static) build/development -p 8081 & npm start