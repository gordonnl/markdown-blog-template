const INDEX = `${__dirname}/../index.html`;
const PAGES = `${__dirname}/../pages/`;
const POSTS = `${__dirname}/../posts/`;
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

function createHtmlPage(file, dirPath) {
  checkBox(`building ${file}...`);

  isBlogPost = dirPath == POSTS;
  
  // Get markdown text
  let markdownText = fs.readFileSync(dirPath + file, 'utf8');

  if (isBlogPost) {
    const rule = /(?<=Date: )\S+/;  // Regex for the complete token, anchor to string start
    const match_date = rule.exec(markdownText)[0];
    const d = new Date(match_date);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#syntax
    markdownText = markdownText.replace(("Date: " + match_date), `### ${d.toLocaleString('default', { month: 'long', year: 'numeric' })}`)
  }

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
}


// Get index.html text
const index = fs.readFileSync(INDEX, 'utf8');

// scrape pages folder for markdown files
const pages = fs.readdirSync(PAGES);
pages.forEach(file => {
  createHtmlPage(file, PAGES);
});


// scrape pages folder for markdown files
const posts = fs.readdirSync(POSTS);
posts.forEach(file => {
  createHtmlPage(file, POSTS);
});