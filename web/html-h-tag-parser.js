import {JSDOM} from 'jsdom'

export default function jsDomParser(sanitizedHtmlString){

    const dom = new JSDOM(sanitizedHtmlString);

    const hTags = dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const tableOfContents = []

    hTags.forEach(tag => {
        tag.innerHTML = tag.textContent
        tableOfContents.push(tag.outerHTML.trim())
    });

   return tableOfContents
}
