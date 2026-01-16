function hasProp(prop) {
  return function(obj) {
    return obj !== null && typeof obj === "object" && prop in obj;
  };
}
const hasMatch = hasProp("match");
const chunkExists = (chunk) => chunk !== void 0;
function clip({ curr, next, prev, clipBy = 3 }) {
  const words = curr.text.split(" ");
  const len = words.length;
  if (curr.match || clipBy >= len) {
    return curr.text;
  }
  const ellipsis = "...";
  if (chunkExists(next) && chunkExists(prev) && hasMatch(prev) && hasMatch(next)) {
    if (len > clipBy * 2) {
      return [...words.slice(0, clipBy), ellipsis, ...words.slice(-clipBy)].join(" ");
    }
    return curr.text;
  }
  if (chunkExists(next) && hasMatch(next)) {
    return [ellipsis, ...words.slice(-clipBy)].join(" ");
  }
  if (chunkExists(prev) && hasMatch(prev)) {
    return [...words.slice(0, clipBy), ellipsis].join(" ");
  }
  return curr.text;
}
export {
  clip as default
};
