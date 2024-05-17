import {
  sanitizeHtmlString,
  jsDomParser,
  createHrefTags,
  nestHTags,
} from "./toc-functions.js";
export default function createToc(htmlString) {

  const htmlStringWithoutUneccesaryStyles = sanitizeHtmlString(htmlString);

  const headings = jsDomParser(htmlStringWithoutUneccesaryStyles);

  const lisWithHrefTags = createHrefTags(headings);

  const nestedTags = nestHTags(lisWithHrefTags);

 const toc = {
  tocHtml : nestedTags,
  tocJson : lisWithHrefTags
 }

 return toc
}

