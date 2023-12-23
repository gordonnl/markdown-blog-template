const INDEX = `${__dirname}/../index.html`;
const PAGES_DIR = `${__dirname}/../pages/`;
const POSTS_DIR = `${__dirname}/../posts/`;
const BUILD_DIR = `${__dirname}/../docs/`;

const fs = require('fs');
const { marked } = require('marked');
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

        let numPosts = posts.length;
        let limit = token.caption[0].text.split(' ')[0];
        if (limit && !isNaN(limit)) {
            numPosts = Math.min(parseInt(limit), posts.length);
        }

        for (let i = 0; i < numPosts; i++) {
            const post = posts[i];
            htmlString += `
        <div class="row project-teaser-container">
            <a class="post-item-link" href="${post.filepath}">
            <div class="four columns preview-img-container">
                <img src="${post.previewImg}"
                    class="preview-img"/>
            </div>
            <div class="eight columns">
                <p class="project-title">
                    <b>${post.title} <span><img src="assets/css/arrow-up-right-from-square-solid.svg" class="linkIcon" alt="${post.title} Project Teaser Image"></span></b>
                </p>
                <p class="project-subtitle">${post.content}...</p>
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
    constructor(filepath, title, date, previewImg, preview) {
        this.filepath = filepath;
        this.title = title;
        this.date = date;
        this.previewImg = previewImg;
        this.content = preview;
    }
}

// Add extensions (custom markdown token parsing)
marked.use({ extensions: [extns.imageCaption, extns.customId, postList] });

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
      const hljs = require('highlight.js');
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
  });


/// Parses the date out of a markdown document
function get_datestring(markdownText) {
    const rule = /(?<=Date: )\S+/;  // Regex for the complete token, anchor to string start
    const dateString = rule.exec(markdownText)[0];
    return dateString;
}

function createHtmlPosts(post_folders) {
    post_folders.forEach(dir => {
        const dir_path = `${POSTS_DIR}/${dir}`
        if (fs.lstatSync(dir_path).isDirectory()) {
            const post_filepaths = fs.readdirSync(`${dir_path}`);
            post_filepaths.forEach(file => {
                if (!fs.lstatSync(`${dir_path}/${file}`).isDirectory() && file.includes('.md')) {
                    createHtmlFromPost(file, `${dir_path}/`);
                }
            })
        }
        else {
            console.log(`Found file ${dir}, expected a directory instead.`)
        }
    });
}

function createHtmlFromPost(file, dirPath) {
    checkBox(`building ${file}...`);
    const outputFile = file.replace('.md', '.html');

    let date;

    // Get markdown text
    let markdownText = fs.readFileSync(dirPath + file, 'utf8');

    const dateString = get_datestring(markdownText);
    date = new Date(dateString);
    // https://developer.mozilla.org/en-US/src/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#syntax
    markdownText = markdownText.replace(("Date: " + dateString), `### ${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`)

    // Add return to home link at the bottom of markdown file
    if (file !== "index.md")
        markdownText += "\n<br>[back to home](index.html)"

    // Convert markdown to html
    let content = marked.parse(markdownText);


    // Replace index dev script with page content
    let output = index.replace('<script type="module" src="./utils/dev.js"></script>', content);

    // Replace title with content of first <h1> tag
    const newTitle = output.match(/>(.*?)<\/h1>/)[1] || null;
    if (newTitle) output = output.replace(/<title>(.*?)<\/title>/, `<title>${newTitle}</title>`);

    const previewImgRegexMatch = output.match(/<PreviewImg>(.*?)<\/PreviewImg>/);
    const previewImgPath = previewImgRegexMatch ? previewImgRegexMatch[1] : 'docs/assets/images/amazon-logo.png';

    const hidefromBlog = output.match(/!HideFromBlog/);
    output = output.replace(/!HideFromBlog/, ``);

    // Get a teaser from the start of the text of the blog, ignoring the first image
    let contentStartIndex = markdownText.indexOf(':\n<br>\n\n', newTitle.length + 3) + 8;
    let contentPreview = markdownText.substring(contentStartIndex, contentStartIndex + 150).trim();
    const post = new Post(outputFile, newTitle, date, previewImgPath, contentPreview);
    if (!hidefromBlog) {
        posts.push(post);
    }

    // Replace 'docs/assets' links with 'assets'
    output = output.replace(/docs\/assets/g, 'assets');

    // Remove the preview image tag
    output = output.replace(/<PreviewImg>(.*?)<\/PreviewImg>/,"");

    // Replace local '?' dev links with built '.html'
    output = output.replace(/href="\?(.*?)"/g, 'href="$1.html"')

    // Output built html to build folder
    fs.writeFileSync(BUILD_DIR + outputFile, output);

    checkBox(`${outputFile} built`, true);
}

function createHtmlFromPage(file, dirPath) {
    checkBox(`building ${file}...`);

    // Get markdown text
    let markdownText = fs.readFileSync(dirPath + file, 'utf8');

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
    fs.writeFileSync(BUILD_DIR + outputFile, output);

    checkBox(`${outputFile} built`, true);
}


// Get index.html text
const index = fs.readFileSync(INDEX, 'utf8');

// scrape post folder for markdown files and convert them to html
const post_folders = fs.readdirSync(POSTS_DIR);
createHtmlPosts(post_folders);

// sort the posts list by date
posts.sort((a, b) => {
    return b.date - a.date;
});

// scrape pages folder for markdown files and convert them to html
const page_filepaths = fs.readdirSync(PAGES_DIR);
page_filepaths.forEach(file => {
    createHtmlFromPage(file, PAGES_DIR);
});
