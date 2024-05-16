import sanitizeHtml from "sanitize-html";
import { JSDOM } from "jsdom";

export function sanitizeHtmlString(htmlString) {
  const allowedTags = sanitizeHtml.defaults.allowedTags.concat(["img"]); // Concatenate default allowed tags with 'img'

  const sanitizedHtml = sanitizeHtml(htmlString, {
    allowedTags: allowedTags,
    allowedAttributes: {
      // Allow all attributes for the 'img' tag
      img: [
        "alt",
        "align",
        "border",
        "height",
        "hspace",
        "longdesc",
        "vspace",
        "width",
        "src",
        "usemap",
        "ismap",
        "class",
        "title",
      ],
    },
    // allowedClasses: {}, // Remove all classes
    allowedClasses: true, // Allow all classes

  });
  return sanitizedHtml;
}

export function removeSpanElements(sanitizedHtmlString) {
  const dom = new JSDOM(sanitizedHtmlString);

  const spans = dom.window.document.querySelectorAll("span");

  spans.forEach(function (span) {
    let text = dom.window.document.createTextNode(span.textContent);
    span.parentNode.replaceChild(text, span);
  });

  return dom.serialize();
}

export function setIdsToHeaderElements(htmlString) {
  const dom = new JSDOM(htmlString);

  const hTags = dom.window.document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  hTags.forEach((tag) => {
    let text = tag.innerHTML;

    if (text.includes("&nbsp")) {
      text = text.replace(/&nbsp;/g, " ").trim();
    }

    let tries = 10;
    if (text.match(/[".,:?-]/)) {
      while (text.match(/[".,:?-]/)) {
        if (tries == 0) {
          console.log("error with formatting text");
          return;
        }
        text = text.replace(/[".,:?-]/, "");
        tries--;
      }
    }

    const generatedId = `${text
      .trim()
      .toLocaleLowerCase()
      .split(" ")
      .join("-")}`;

    tag.id = generatedId;
  });

  dom.window.document.querySelector('div').classList = "prose prose-2xl text-black mx-auto mt-8 px-8 prose-img:rounded-xl"

  let domWithAddedIds = dom.serialize();
  
  return domWithAddedIds;
}
