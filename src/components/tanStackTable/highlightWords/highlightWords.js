import clip from "./clip";
import buildRegexp from "./regexp";
import uid from "./uid";
const hasLength = (str) => str.length > 0;
const highlightWords = ({ text, query, clipBy, matchExactly = false }) => {
  const safeQuery = typeof query === "string" ? query.trim() : query;
  if (safeQuery === "") {
    return [
      {
        key: uid(),
        text,
        match: false
      }
    ];
  }
  const searchRegexp = buildRegexp({ terms: query, matchExactly });
  return text.split(searchRegexp).filter((element) => hasLength(element)).map((str) => ({
    // Compose the object for a match
    key: uid(),
    text: str,
    match: matchExactly ? str.toLowerCase() === safeQuery.toLowerCase() : searchRegexp.test(str)
  })).map((chunk, index, chunks) => ({
    // For each chunk, clip the text if needed
    ...chunk,
    // All the props first
    ...typeof clipBy === "number" && {
      // We only overwrite the text if there is a clip
      text: clip({
        curr: chunk,
        // We need the current chunk
        ...index < chunks.length - 1 && { next: chunks[index + 1] },
        // If this wasn't the last chunk, set the next chunk
        ...index > 0 && { prev: chunks[index - 1] },
        // If this wasn't the first chunk, set the previous chunk
        clipBy
      })
    }
  }));
};
var highlightWords_default = highlightWords;
export {
  highlightWords_default as default
};
