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
 toc.tocHtml = `<nav class="toc">${toc.tocHtml}
 <svg class="toc-marker" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10 L190 190" stroke="#444" stroke-width="3" fill="transparent" stroke-dasharray="0, 0, 0, 1000" stroke-linecap="round" stroke-linejoin="round" transform="translate(-0.5, -0.5)" />
</svg>

 </nav>`


 return toc
}

