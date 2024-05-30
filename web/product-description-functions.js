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

  // const bodyElement = dom.window.document.querySelector('body')
  // let script = dom.window.document.createElement('script')
  // script.text = `window.onload = function() {

  //   var toc = document.querySelector( '.toc' );
  //   var tocPath = document.querySelector( '.toc-marker path' );
  //   var tocItems;

  //   // Factor of screen size that the element must cross
  //   // before it's considered visible
  //   var TOP_MARGIN = 0.1,
  //     BOTTOM_MARGIN = 0.2;

  //   var pathLength;

  //   var lastPathStart,
  //     lastPathEnd;

  //   window.addEventListener( 'resize', drawPath, false );
  //   window.addEventListener( 'scroll', sync, false );

  //   drawPath();

  //   function drawPath() {

  //     tocItems = [].slice.call( toc.querySelectorAll( 'li' ) );

  //     // Cache element references and measurements
  //     tocItems = tocItems.map( function( item ) {
  //       var anchor = item.querySelector( 'a' );
  //       var target = document.getElementById(decodeURI(anchor.getAttribute( 'href' )).split('#')[1]);


  //       return {
  //         listItem: item,
  //         anchor: anchor,
  //         target: target
  //       };
  //     } );

  //     // Remove missing targets
  //     tocItems = tocItems.filter( function( item ) {
  //       return !!item.target;
  //     } );

  //     var path = [];
  //     var pathIndent;

  //     tocItems.forEach( function( item, i ) {

  //       var x = item.anchor.offsetLeft - 5,
  //         y = item.anchor.offsetTop,
  //         height = item.anchor.offsetHeight;

  //       if( i === 0 ) {
  //         path.push( 'M', x, y, 'L', x, y + height );
  //         item.pathStart = 0;
  //       }
  //       else {
  //         // Draw an additional line when there's a change in
  //         // indent levels
  //         if( pathIndent !== x ) path.push( 'L', pathIndent, y );

  //         path.push( 'L', x, y );

  //         // Set the current path so that we can measure it
  //         tocPath.setAttribute( 'd', path.join( ' ' ) );
  //         item.pathStart = tocPath.getTotalLength() || 0;

  //         path.push( 'L', x, y + height );
  //       }

  //       pathIndent = x;

  //       tocPath.setAttribute( 'd', path.join( ' ' ) );
  //       item.pathEnd = tocPath.getTotalLength();

  //     } );

  //     pathLength = tocPath.getTotalLength();

  //     sync();

  //   }

  //   function sync() {

  //     var windowHeight = window.innerHeight;

  //     var pathStart = pathLength,
  //       pathEnd = 0;

  //     var visibleItems = 0;

  //     tocItems.forEach( function( item ) {

  //       var targetBounds = item.target.getBoundingClientRect();

  //       if( targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * ( 1 - BOTTOM_MARGIN ) ) {
  //         pathStart = Math.min( item.pathStart, pathStart );
  //         pathEnd = Math.max( item.pathEnd, pathEnd );

  //         visibleItems += 1;

  //         item.listItem.classList.add( 'visible' );
  //       }
  //       else {
  //         item.listItem.classList.remove( 'visible' );
  //       }

  //     } );

  //     // Specify the visible path or hide the path altogether
  //     // if there are no visible items
  //     if( visibleItems > 0 && pathStart < pathEnd ) {
  //       if( pathStart !== lastPathStart || pathEnd !== lastPathEnd ) {
  //         tocPath.setAttribute( 'stroke-dashoffset', '1' );
  //         tocPath.setAttribute( 'stroke-dasharray', '1, '+ pathStart +', '+ ( pathEnd - pathStart ) +', ' + pathLength );
  //         tocPath.setAttribute( 'opacity', 1 );
  //       }
  //     }
  //     else {
  //       tocPath.setAttribute( 'opacity', 0 );
  //     }

  //     lastPathStart = pathStart;
  //     lastPathEnd = pathEnd;

  //   }

  // };`
  //   let css = dom.window.document.createElement('style')
  //   css.textContent = `
  // .toc {
  //   position: fixed;
  //   left: -35em;
  //   top: 5em;
  //   width: 35em;
  //   padding: 1em;
  //   line-height: 2;
  //   text-align : start;
  // }
  // .toc ul {
  //   list-style: none;
  //   padding: 0;
  //   margin: 0; }
  // .toc ul ul {
  //   padding-left: 2em;
  //  }
  // .toc li a {
  //   display: inline-block;
  //   color: #aaa;
  //   text-decoration: none;
  //   transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  //  }
  // .toc li.visible > a {
  //   color: #111;
  //   transform: translate(5px); 
  // }
  // .toc-marker {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 100%;
  //   height: 100%;
  //   z-index: -1;
  //  }
  //  .toc-marker path {
  //     transition: all 0.3s ease; }
  // `
  // bodyElement.appendChild(css)
  // bodyElement.appendChild(script)

  let domWithAddedIds = dom.serialize();

  return domWithAddedIds;
}

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
    } else if (currentSection) {
      currentSection.appendChild(child);
    } else {
      // If there is no current section, create a temporary section to hold non-heading content
      currentSection = document.createElement('section');
      currentSection.appendChild(child);
    }
  }

  // Convert childNodes to an array to avoid issues when modifying the DOM while iterating
  Array.from(divElement.childNodes).forEach(processChild);

  // Append the last section if it exists and has content
  appendCurrentSection();

  // Remove any initially empty sections that might have been created
  Array.from(divElement.querySelectorAll('section')).forEach((section) => {
    if (section.childNodes.length === 0) {
      section.remove();
    }
  });

  return dom.serialize();
}
