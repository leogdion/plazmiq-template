clean:
	git clean -x -d -f --exclude=".aws-credentials.json"
clean-dry-run:
	git clean -x -d -n --exclude=".aws-credentials.json"