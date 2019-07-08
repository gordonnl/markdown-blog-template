# Github-hosted markdown blog

### Steps

1. fork repository
2. in the settings, activate Github Pages using `/docs` as the source
3. start writing markdown content in the `pages` folder
    - use `?` suffix for local links to other pages eg `?page2`
    - use `docs/assets` to store assets
4. Serve `index.html` locally to display markdown dynamically while writing 

### Ready to build?

4. run `node utils/build.js` to generate html into `/docs` folder

### Custom domain?

5. under Github Pages settings, add custom url and enforce HTTPS

## Structure
 
 - index.html
 - assets
     - css
         - main.css
     - images
         - favicon.png
 - pages
     - index.md
     - test.md
 - utils
     - lib
         - checkbox.js
         - Marked.js
         - Highlight.js
     - build.js
     - dev.js
