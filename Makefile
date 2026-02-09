dist/js/app.js:
	bun run build.js

.PHONY: install
install:
	bun install

.PHONY: clean
clean:
	rm -rf dist/js/*
	rm -rf dist/css/*

.PHONY: fclean
fclean: clean
	rm -rf node_modules/

.PHONY: serve
serve:
	bun run serve dist
