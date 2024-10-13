// Function to escape special characters in a regular expression
const escapeRegExp = (str: string) => {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
};

// Function to replace all occurrences of a substring in a string
const replaceAll = (str: string, find: string, replace: string) => {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
};

// Function to convert an SVG string to a data URI
const svgToDataUri = (svg: string) => {
  let encoded = svg;

  // Normalizing SVG string
  encoded = svg.replace(/\s+/g, " "); // Remove extra white spaces
  encoded = replaceAll(encoded, "%", "%25"); // Encode percent sign
  encoded = replaceAll(encoded, "> <", "><"); // Normalize spaces between elements
  encoded = replaceAll(encoded, "; }", ";}"); // Normalize spaces in CSS
  encoded = replaceAll(encoded, "<", "%3c"); // Encode less than sign
  encoded = replaceAll(encoded, ">", "%3e"); // Encode greater than sign
  encoded = replaceAll(encoded, '"', "'"); // Normalize quotes
  encoded = replaceAll(encoded, "#", "%23"); // Encode hash sign
  encoded = replaceAll(encoded, "{", "%7b"); // Encode left curly brace
  encoded = replaceAll(encoded, "}", "%7d"); // Encode right curly brace
  encoded = replaceAll(encoded, "|", "%7c"); // Encode pipe symbol
  encoded = replaceAll(encoded, "^", "%5e"); // Encode caret symbol
  encoded = replaceAll(encoded, "`", "%60"); // Encode backtick symbol
  encoded = replaceAll(encoded, "@", "%40"); // Encode at symbol

  return "data:image/svg+xml;charset=UTF-8," + encoded.trim(); // Return data URI
};

export default svgToDataUri; // Export the svgToDataUri function
