const INDEX = `${__dirname}/../index.html`;
const PAGES = `${__dirname}/../pages/`;
const BUILD = `${__dirname}/../docs/`;

const fs = require('fs');
const { marked } = require('marked');
const highlight = require('./lib/highlight-node');
const checkBox = require('./lib/checkBox');
const extns = require('./extensions');

// Add extensions (custom markdown token parsing)
marked.use({ extensions: [extns.imageCaption] });

marked.setOptions({
    langPrefix: '',
    highlight: function(code) {
        return highlight.highlightAuto(code).value;
    },
});

// Get index.html text
const index = fs.readFileSync(INDEX, 'utf8');

// scrape pages folder for markdown files
const markdown = fs.readdirSync(PAGES);
markdown.forEach(file => {
    checkBox(`building ${file}...`);

    // Get markdown text
    let markdownText = fs.readFileSync(PAGES + file, 'utf8');

    // Add return to home link at the bottom of markdown file
    if (file !== "index.md")
      markdownText += "\n<br>[back to home](index.html)"
    
    // Convert markdown to html
    const content = marked.parse(markdownText);
    
    // Replace index dev script with page content
    let output = index.replace('<script type="module" src="./utils/dev.js"></script>', content);

    // Replace title with content of first <h1> tag
    const newTitle = output.match(/>(.*?)<\/h1>/)[1] || null;
    if (newTitle) output = output.replace(/<title>(.*?)<\/title>/, `<title>${newTitle}</title>`);

    // Replace 'docs/assets' links with 'assets'
    output = output.replace(/docs\/assets/g, 'assets');

    // Replace local '?' dev links with built '.html'
    output = output.replace(/href="\?(.*?)"/g, 'href="$1.html"')

    // Output built html to build folder
    const outputFile = file.replace('.md', '.html');
    fs.writeFileSync(BUILD + outputFile, output);

    checkBox(`${outputFile} built`, true);
});