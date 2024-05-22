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

export function jsDomParser(sanitizedHtmlString) {
  const dom = new JSDOM(sanitizedHtmlString);

  const hTags = dom.window.document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  const headings = [];

  hTags.forEach((tag) => {
    if (tag.textContent) {
      if (tag.textContent != "") {
        tag.innerHTML = tag.textContent;
        headings.push(tag.outerHTML.trim());
      }
    }
  });

  return headings;
}

export function createHrefTags(headings) {
  const hrefTags = [];

  headings.forEach((heading, index) => {
    let text = heading.replace(/<[^>]+>/g, "").trim();

    if (text.includes("&nbsp")) {
      text = text.replace(/&nbsp;/g, " ").trim();
    }

    let liText = text;

    let liTextTries = 10;
    if (liText.match(/[".,:?]/)) {
      while (liText.match(/[".,:?]/)) {
        if (liTextTries == 0) {
          console.log("error with formatting liText");
          return;
        }
        liText = liText.replace(/[".,:?]/, "");
        liTextTries--;
      }
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

    const href = `#${text.trim().toLocaleLowerCase().split(" ").join("-")}`;

    let tagAttributes = {
      heading: null,
      liClass: null,
      anchorClass: null,
      href: href,
      text: liText,
      children: [],
    };

    let toc = {
      content: liText,
      slug: href,
      lvl: null,
    };

    if (heading.match(/\<h1>/)) {
      (tagAttributes.heading = "h1"), (toc.lvl = 1);
    } else if (heading.match(/\<h2>/)) {
      tagAttributes.heading = "h2";
      tagAttributes.liClass = "ml-2 mt-2";
      tagAttributes.anchorClass = "text-blue-500 hover:underline";
      toc.lvl = 2;
    } else if (heading.match(/\<h3>/)) {
      tagAttributes.heading = "h3";
      tagAttributes.liClass = "ml-4 mt-2";
      tagAttributes.anchorClass = "text-blue-500 hover:underline";
      toc.lvl = 3;
    } else if (heading.match(/\<h4>/)) {
      tagAttributes.heading = "h4";
      tagAttributes.liClass = "ml-6 mt-2";
      tagAttributes.anchorClass = "text-blue-500 hover:underline";
      toc.lvl = 4;
    } else if (heading.match(/\<h5>/)) {
      tagAttributes.heading = "h5";
      tagAttributes.liClass = "ml-8 mt-2";
      tagAttributes.anchorClass = "text-blue-500 hover:underline";
      toc.lvl = 5;
    } else if (heading.match(/\<h6>/)) {
      tagAttributes.heading = "h6";
      tagAttributes.liClass = "ml-10 mt-2";
      tagAttributes.anchorClass = "text-blue-500 hover:underline";
      toc.lvl = 6;
    }

    hrefTags.push(tagAttributes);
  });

  return hrefTags;
}

export function nestHTags(hTags) {
  const nestedHeadings = [];
  let currentH1 = null;
  let currentH2 = null;
  let currentH3 = null;
  let currentH4 = null;
  let currentH5 = null;

  hTags.forEach((heading) => {
    if (heading.heading === "h1") {
      // If it's an h1, add it directly to the nested structure
      nestedHeadings.push(heading);
      currentH1 = heading;
      currentH2 = null;
      currentH3 = null;
      currentH4 = null;
      currentH5 = null;
    } else if (heading.heading === "h2") {
      // If it's an h2, add it directly to the nested structure
      if (currentH1) {
        if (!currentH1.children) {
          currentH1.children = [];
        }
        currentH1.children.push(heading);
        currentH2 = heading;
        currentH3 = null;
        currentH4 = null;
        currentH5 = null;
      } else {
        nestedHeadings.push(heading);
        currentH2 = heading;
        currentH3 = null;
        currentH4 = null;
        currentH5 = null;
      }
    } else if (heading.heading === "h3") {
      // If it's an h3, add it directly to the nested structure
      if (currentH2) {
        if (!currentH2.children) {
          currentH2.children = [];
        }
        currentH2.children.push(heading);
        currentH3 = heading;
        currentH4 = null;
        currentH5 = null;
      } else {
        nestedHeadings.push(heading);
        currentH3 = heading;
        currentH4 = null;
        currentH5 = null;
      }
    } else if (heading.heading === "h4") {
      // If it's an h4, add it directly to the nested structure
      if (currentH3) {
        if (!currentH3.children) {
          currentH3.children = [];
        }
        currentH3.children.push(heading);
        currentH4 = heading;
        currentH5 = null;
      } else {
        nestedHeadings.push(heading);
        currentH4 = heading;
        currentH5 = null;
      }
    } else if (heading.heading === "h5") {
      // If it's an h5, add it directly to the nested structure
      if (currentH4) {
        if (!currentH4.children) {
          currentH4.children = [];
        }
        currentH4.children.push(heading);
        currentH5 = heading;
      } else {
        nestedHeadings.push(heading);
        currentH5 = heading;
      }
    } else if (heading.heading === "h6") {
      // If it's an h6, add it directly to the nested structure
      if (currentH5) {
        if (!currentH5.children) {
          currentH5.children = [];
        }
        currentH5.children.push(heading);
      } else {
        nestedHeadings.push(heading);
      }
    } else {
      // If it's any other heading or if there's no suitable parent, add it directly to the nested structure
      nestedHeadings.push(heading);
    }
  });

  const finalToc = generateNestedHTML(nestedHeadings);

  return finalToc;
}

function generateNestedHTML(headings) {
  let html = "<ul>";

  headings.forEach((heading) => {
    html += `<li ${heading.liClass ? `class="${heading.liClass}"` : ""}><a ${
      heading.anchorClass ? `class="${heading.anchorClass}"` : ""
    } href="${heading.href}">${heading.text}</a>`;

    if (heading.children && heading.children.length > 0) {
      html += generateNestedHTML(heading.children);
    }

    html += "</li>";
  });

  html += `</ul>`;

  return html
}
