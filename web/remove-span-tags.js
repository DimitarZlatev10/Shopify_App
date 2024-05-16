import {JSDOM} from 'jsdom'

export default function removeSpanElements(sanitizedHtmlString){

    const dom = new JSDOM(sanitizedHtmlString);

    const spans = dom.window.document.querySelectorAll('span');

    spans.forEach(function(span) {
        let text = dom.window.document.createTextNode(span.textContent);
        span.parentNode.replaceChild(text, span);
    });
    
    return dom.serialize();
}
