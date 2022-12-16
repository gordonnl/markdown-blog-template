
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
    return `<p style="text-align: center; margin-top:-5px"><i>${this.parser.parseInline(token.caption)}</i></p>\n`;
  },
  childtokens: ['caption'],                 // Any child tokens to be visited by walkTokens
};
  
module.exports = { imageCaption };
