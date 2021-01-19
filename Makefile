show_task:
	task project:poker_manager 

build: css html js

css:
	export PATH=${PATH}:${HOME}/.gem/ruby/2.7.0/bin/ && cd assets && compass compile

html:
	python tools/jparser.py templates/range_manager_ui.j2 > range_manager.html

js:
	python tools/jparser.py assets/js/parts/range_manager.js > assets/js/range_manager.js

lintjs:
	eslint assets/js/range_manager.js
