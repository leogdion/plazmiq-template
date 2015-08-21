all: depend
	gulp 
clean:
	git clean -x -d -f --exclude=".aws-credentials.json"
clean-dry-run:
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
publish: 
	gulp publish