test:
	@./node_modules/.bin/mocha --compilers coffee:coffee-script --require should
document:
	@./node_modules/.bin/docco "octo.js"

.PHONY: test