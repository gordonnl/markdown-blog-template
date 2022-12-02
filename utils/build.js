const INDEX = `${__dirname}/../index.html`;
const PAGES = `${__dirname}/../pages/`;
const BUILD = `${__dirname}/../docs/`;

const fs = require('fs');
const marked = require('marked');
const highlight = require('./lib/highlight-node');
const checkBox = require('./lib/checkBox');

const imageCaption = {
    name: 'imageCaption',
    level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
    start(src) { return src.match(/:/)?.index; },    // Hint to Marked.js to stop and check for a match
    tokenizer(src, tokens) {
      const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
      const match = rule.exec(src);
      if (match) {
        return {                                         // Token to generate
          type: 'imageCaption',                          // Should match "name" above
          raw: match[0],                                 // Text to consume from the source
          caption: this.lexer.inlineTokens(match[1].trim())   // Additional custom properties, including
        };
      }
    },
    renderer(token) {
      return `<p style="text-align: center; margin-top:-5px">${this.parser.parseInline(token.caption)}</p>\n`;
    },
    childtokens: ['caption'],                 // Any child tokens to be visited by walkTokens
};
marked.use({ extensions: [imageCaption] });

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
    const markdownText = fs.readFileSync(PAGES + file, 'utf8');

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