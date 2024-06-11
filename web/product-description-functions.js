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
        "loading",
        "decoding",
      ],
    },
    // allowedClasses: {}, // Remove all classes
    allowedClasses: true, // Allow all classes

  });
  return sanitizedHtml;
}

export function removeSpanElements(sanitizedHtmlString) {
  const dom = new JSDOM(sanitizedHtmlString);

  const document = dom.window.document;

  const spans = document.querySelectorAll('span');

  spans.forEach(span => {
    const parent = span.parentNode;

    // Move all child nodes of the span to its parent
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }

    // Remove the empty span
    parent.removeChild(span);
  });

  const imgs = document.querySelectorAll('img')

  const imageServer = `https://vitaon.bg/cdn/shop/files/`
  imgs.forEach((img) => {
    const imageName = img.src.split('/files/')[2]
    if (imageName) {
      let link = `${imageServer}${imageName}&width=480`
      let fullUrl = link.replace('_480x480', '')
      img.src = fullUrl
    }
  })

  return dom.serialize();
}

export function setIdsToHeaderElements(htmlString) {
  const dom = new JSDOM(htmlString);

  function replaceParentWithImg(tagName) {
    dom.window.document.querySelectorAll(tagName).forEach(tag => {
        const img = tag.querySelector('img');
        if (img ) {
            tag.replaceWith(img);
        }
    });
}
replaceParentWithImg('p');
['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(headerTag => replaceParentWithImg(headerTag));

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

// export function addSectionsToHeaderTags(htmlString) {
//   const dom = new JSDOM(htmlString);
//   const document = dom.window.document;

//   const divElement = document.querySelector('div');

//   let currentSection = null;

//   function appendCurrentSection() {
//     if (currentSection && currentSection.childNodes.length > 0) {
//       divElement.appendChild(currentSection);
//     }
//     currentSection = null;
//   }

//   function processChild(child) {
//     if (child.tagName && child.tagName.startsWith('H')) {
//       appendCurrentSection();

//       currentSection = document.createElement('section');
//       currentSection.id = child.id; // Set the section id to the heading id
//       child.removeAttribute('id'); // Remove the id from the heading
//       currentSection.appendChild(child); // Move the heading into the section
//     } else if (child.tagName === 'SECTION') {
//       // Recursively process children of the nested section
//       Array.from(child.childNodes).forEach(processChild);
//       appendCurrentSection();
//     } else if (currentSection) {
//       currentSection.appendChild(child);
//     } else {
//       // If there is no current section, create a temporary section to hold non-heading content
//       currentSection = document.createElement('section');
//       currentSection.appendChild(child);
//     }
//   }

//   // Convert childNodes to an array to avoid issues when modifying the DOM while iterating
//   Array.from(divElement.childNodes).forEach(processChild);

//   // Append the last section if it exists and has content
//   appendCurrentSection();

//   // Remove any initially empty sections that might have been created
//   Array.from(divElement.querySelectorAll('section')).forEach((section) => {
//     if (section.childNodes.length === 0) {
//       section.remove();
//     }
//   });

//   return dom.serialize();
// }

export function addSectionsToHeaderTags(htmlString) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const divElement = document.querySelector('div');

  let currentSection = null;

  function appendCurrentSection() {
    if (currentSection && currentSection.childNodes.length > 0) {
      divElement.appendChild(currentSection);
    }
    currentSection = null;
  }

  function processChild(child) {
    if (child.tagName && child.tagName.startsWith('H')) {
      appendCurrentSection();

      currentSection = document.createElement('section');
      currentSection.id = child.id; // Set the section id to the heading id
      child.removeAttribute('id'); // Remove the id from the heading
      currentSection.appendChild(child); // Move the heading into the section
    } else if (child.tagName === 'SECTION') {
      // Recursively process children of the nested section
      Array.from(child.childNodes).forEach(processChild);
      appendCurrentSection();
    } else {
      if (!currentSection) {
        currentSection = document.createElement('section');
      }
      currentSection.appendChild(child);
    }
  }

  function processMultipleHeadings(section) {
    Array.from(section.childNodes).forEach((child) => {
      if (child.tagName && child.tagName.startsWith('H')) {
        appendCurrentSection();
        currentSection = document.createElement('section');
        currentSection.id = child.id; // Set the section id to the heading id
        child.removeAttribute('id'); // Remove the id from the heading
        currentSection.appendChild(child); // Move the heading into the section
      } else {
        if (!currentSection) {
          currentSection = document.createElement('section');
        }
        currentSection.appendChild(child);
      }
    });
    appendCurrentSection();
  }

  // Convert childNodes to an array to avoid issues when modifying the DOM while iterating
  Array.from(divElement.childNodes).forEach((child) => {
    if (child.tagName === 'SECTION') {
      processMultipleHeadings(child);
    } else {
      processChild(child);
    }
  });

  // Append the last section if it exists and has content
  appendCurrentSection();

  // Remove any initially empty sections that might have been created
  Array.from(divElement.querySelectorAll('section')).forEach((section) => {
    if (section.childNodes.length === 0) {
      section.remove();
    }
  });

  // Ensure no empty sections remain
  Array.from(divElement.querySelectorAll('section')).forEach((section) => {
    if (!section.hasChildNodes() ||
      (section.childNodes.length === 1 && section.firstChild.tagName && section.firstChild.tagName.startsWith('H'))) {
      section.remove();
    }
  });

  dom.serialize()

   dom.window.document.querySelectorAll('section').forEach((section)=>{
    if(section.textContent.trim() == ''){
      section.remove()
    }
  })

  return dom.serialize();
}
