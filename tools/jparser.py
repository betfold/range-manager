# -*- coding: utf_8 -*-

# mer. 13 janv. 2021 10:34

import sys, os

from jinja2 import Environment, FileSystemLoader
from jinja_markdown import MarkdownExtension

if len(sys.argv) == 1:
    print("you must set a filepath")
    exit();
    
mdfile = sys.argv[1]
nfile = os.path.basename(mdfile)
ptemplate = os.path.dirname(mdfile)


env = Environment(loader=FileSystemLoader(ptemplate))
env.add_extension(MarkdownExtension)
template = env.get_template(nfile)
#output_from_parsed_template = template.render(foo='Hello World!')
output_from_parsed_template = template.render()
print(output_from_parsed_template)
