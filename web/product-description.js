import {
  sanitizeHtmlString,
  removeSpanElements,
  setIdsToHeaderElements,
} from "./product-description-functions.js";
export default function createProductDescription(htmlString) {

  const htmlStringWithoutUneccesaryStyles = sanitizeHtmlString(htmlString);

  const htmlStringWithoutSpanElements = removeSpanElements(
    htmlStringWithoutUneccesaryStyles
  );

  const setHeaderIds = setIdsToHeaderElements(htmlStringWithoutSpanElements);

  return setHeaderIds;
}
