show_task:
	task project:poker_manager 

build: css html

css:
	export PATH=${PATH}:${HOME}/.gem/ruby/2.7.0/bin/ && cd assets && compass compile

html:
	python tools/jparser.py templates/range_manager_ui.j2 > range_manager.html
