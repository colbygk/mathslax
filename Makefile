ESLINT=./node_modules/.bin/eslint

test:
	$(ESLINT) *.js
	$(ESLINT) lib/*.js

server:
	node server.js

install:
	npm install

.PHONY: install server test
