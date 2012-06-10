TESTS = test/browser/*.coffee
REPORTER = dot

all: test

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--compilers coffee:coffee-script \
		--require should \
		--reporter $(REPORTER) \
		$(TESTS)

test-server:
	@coffee test/server

octo.min.js: octo.js
	uglifyjs -nm $< > $@

clean:
	rm -f octo.min.js

document:
	@./node_modules/.bin/docco "octo.js"

.PHONY: test