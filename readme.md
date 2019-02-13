## Steps

1. fork repository
2. activate github pages
3. start writing content

### Custom domain?

1. change dns on domain to point to github
2. fork repository
3. activate github pages
4. add custom url to pages
5. start writing content

## Structure
 
 - index.html
 - 404.html
 - assets
     - css
         - main.css
     - images
         - favicon.png
     - js
         - Main.js
         - Marked.js
         - Highlight.js
 - pages
     - index.md
     - test.md

### Explanation

- index.html - homepage
- 404.html - duplicate of homepage, to catch specific page urls
- asset/js/Marked.js - library that converts markdown to html
- asset/js/Highlight.js - library that adds syntax highlighting to code snippets
- asset/js/Main.js - script that reads url, loads page markdown and displays converted html

Note: remember to update the title tag in index.html and 404.html, and to replace the favicon.png with your own.