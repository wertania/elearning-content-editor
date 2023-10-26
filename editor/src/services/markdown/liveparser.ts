/**
 * will parse a markdown document with "markdown-it" and return the result as html
 */

import MarkdownIt from "markdown-it";

// Create an instance of the MarkdownIt class with your configuration options
const md = new MarkdownIt({
  html: true,
  xhtmlOut: true,
  breaks: true,
  // langPrefix: "language-",
  linkify: false,
  typographer: false,
  quotes: "“”‘’",
  //   highlight: function (/*str, lang*/) {
  //     return "";
  //   },
});

export const parseMarkdown = (markdown: string): string => {
  return md.render(markdown);
};
