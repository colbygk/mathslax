ESLINT=./node_modules/.bin/eslint
TAP=./node_modules/.bin/tap

lint:
	$(ESLINT) *.js
	$(ESLINT) lib/*.js

tap:
	$(TAP) test/unit/*.js

test: lint tap

server:
	node server.js

install:
	npm install

.PHONY: install server test
