import {marked} from './Marked.js';
import {hljs} from './Highlight.js';

(async function() {

    // Read url for requested page
    const page = !!window.location.hash ? window.location.hash.slice(3) : location.pathname.split('/').slice(-1)[0];

    // Try to load pages's markdown, or index if none requested
    let response = await fetch(`./pages/${page || 'index'}.md`, {method: 'GET'});

    // If not found, fallback to loading index
    if (!response.ok) response = await fetch(`./pages/index.md`, {method: 'GET'});

    // Get text from response
    const text = await response.text();

    // Replace this page's content with the converted markdown to html
    document.body.innerHTML = marked(text);

    // Apply appropriate code syntax highlighting, if any blocks found
    document.querySelectorAll('code').forEach((block) => !!block.className && hljs.highlightBlock(block));
})();