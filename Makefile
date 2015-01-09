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
all: depend
	gulp 
kill-serve:
	pgrep -f 'node node_modules/node-static/bin/cli.js' | xargs kill
serve-development: kill-serve
	node_modules/node-static/bin/cli.js build/development -p 8081 &	echo $$! >> .pid
serve-production: kill-serve
	node_modules/node-static/bin/cli.js build/production -p 8080 &	echo $$! >> .pid 
serve: kill-serve all serve-development serve-production
watch: depend
	gulp watch
serve-watch: serve watch
publish: 
	gulp publish