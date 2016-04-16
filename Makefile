gulp = node_modules/gulp/bin/gulp.js --harmony
static = node_modules/node-static/bin/cli.js
NODE_PATH := $(source ~/.nvm/nvm.sh >&/dev/null && nvm install >&/dev/null && nvm use >&/dev/null && dirname $(which node))
PATH := $(NODE_PATH):$(shell echo $$PATH)

PHONY: all
depend:
	node_modules/check-dependencies/bin/cli.js || npm install
all: depend
	$(gulp) ${task}
test: depend
	$(gulp) test
prod: all
	$(static) build/production -p 8080 & npm start
clean:
	git clean -x -d -f --exclude=".credentials" --exclude="node_modules"
clean-dry-run:
	git clean -x -d -n --exclude=".credentials" --exclude="node_modules"
clean-cache:
	git clean -x -d -f --exclude=".credentials"
clean-cache-dry-run:
	git clean -x -d -n --exclude=".credentials"
publish:
	$(gulp) publish
dev: all
	$(static) build/development -p 8081 #& npm start
serve: all
	$(static) build/production -p 8080 & $(static) build/development -p 8081 # & npm start
rebuild: clean-cache all
templates: 
	$(gulp) templates