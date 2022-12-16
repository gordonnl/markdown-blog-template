const INDEX = `${__dirname}/../index.html`;
const PAGES_DIR = `${__dirname}/../pages/`;
const POSTS_DIR = `${__dirname}/../posts/`;
const BUILD_DIR = `${__dirname}/../docs/`;

const fs = require('fs');
const { marked } = require('marked');
const highlight = require('./lib/highlight-node');
const checkBox = require('./lib/checkBox');
const extns = require('./extensions');

const postList = {
  name: 'postList',
  level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
  start(src) { return src.match(/:/)?.index; },    // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^!([^!\n]+)!([^!\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
    const match = rule.exec(src);
    if (match) {
      return {                                         // Token to generate
        type: 'postList',                              // Should match "name" above
        raw: match[0],                                 // Text to consume from the source
        caption: this.lexer.inlineTokens(match[1].trim())   // Additional custom properties, including
      };
    }
  },
  renderer(token) {
    let htmlString = ``;

    numPosts = posts.length;

    for (let i = 0; i < numPosts; i++) {
      const post = posts[i];
      htmlString += `
        <div class="post-item">
          <a class="post-item-link" href="${post.filepath}">
            <h2>
              ${post.title}
            </h2>
            <p class="post-item">${post.content}...</p>
            <div class="post-item-footer">
              <span class="post-item-date">— ${post.date.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            </div>
          </a>
        </div>
      `

      if (i < numPosts - 1) {
        htmlString += `<hr />`
      }
    }

    return htmlString;
  },
  childtokens: [],                 // Any child tokens to be visited by walkTokens
};

let posts = [];

class Post {
  constructor(filepath, title, date, preview) {
    this.filepath = filepath;
    this.title = title;
    this.date = date;
    this.content = preview;
  }
}

// Add extensions (custom markdown token parsing)
marked.use({ extensions: [extns.imageCaption, postList] });

marked.setOptions({
  langPrefix: '',
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  },
});



/// Parses the date out of a markdown document
function get_datestring(markdownText) {
  const rule = /(?<=Date: )\S+/;  // Regex for the complete token, anchor to string start
  const dateString = rule.exec(markdownText)[0];
  return dateString;
}


function createHtmlFromPost(file, dirPath) {
  checkBox(`building ${file}...`);
  const outputFile = file.replace('.md', '.html');

  let date;

  // Get markdown text
  let markdownText = fs.readFileSync(dirPath + file, 'utf8');

  const dateString = get_datestring(markdownText);
  date = new Date(dateString);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#syntax
  markdownText = markdownText.replace(("Date: " + dateString), `### ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`)

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

  let contentStartIndex = markdownText.indexOf('\n', newTitle.length + 3);
  let contentPreview = markdownText.substring(contentStartIndex, contentStartIndex + 250).trim();
  const post = new Post(outputFile, newTitle, date, contentPreview);
  posts.push(post);

  // Replace 'docs/assets' links with 'assets'
  output = output.replace(/docs\/assets/g, 'assets');

  // Replace local '?' dev links with built '.html'
  output = output.replace(/href="\?(.*?)"/g, 'href="$1.html"')

  // Output built html to build folder
  fs.writeFileSync(BUILD_DIR + outputFile, output);

  checkBox(`${outputFile} built`, true);
}


function createHtmlFromPage(file, dirPath) {
  checkBox(`building ${file}...`);

  isBlogPost = dirPath == POSTS_DIR;
  let date;

  // Get markdown text
  let markdownText = fs.readFileSync(dirPath + file, 'utf8');

  if (isBlogPost) {
    const dateString = get_datestring(markdownText);
    date = new Date(dateString);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#syntax
    markdownText = markdownText.replace(("Date: " + dateString), `### ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`)
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

  if (isBlogPost) {
    let contentStartIndex = markdownText.indexOf('\n', newTitle.length + 3);
    let contentPreview = markdownText.substring(contentStartIndex, contentStartIndex + 250).trim();
    const post = new Post(newTitle, date, contentPreview);
    posts.push(post);
  }

  // Replace 'docs/assets' links with 'assets'
  output = output.replace(/docs\/assets/g, 'assets');

  // Replace local '?' dev links with built '.html'
  output = output.replace(/href="\?(.*?)"/g, 'href="$1.html"')

  // Output built html to build folder
  const outputFile = file.replace('.md', '.html');
  fs.writeFileSync(BUILD_DIR + outputFile, output);

  checkBox(`${outputFile} built`, true);
}


// Get index.html text
const index = fs.readFileSync(INDEX, 'utf8');

// scrape pages folder for markdown files
const post_filepaths = fs.readdirSync(POSTS_DIR);
post_filepaths.forEach(file => {
  createHtmlFromPost(file, POSTS_DIR);
});

// sort the posts list by date
posts.sort((a, b) => {
  return b.date - a.date;
});

// scrape pages folder for markdown files
const page_filepaths = fs.readdirSync(PAGES_DIR);
page_filepaths.forEach(file => {
  createHtmlFromPage(file, PAGES_DIR);
});
