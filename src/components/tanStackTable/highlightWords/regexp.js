const escapeRegexp = (term) => term.replace(/[|\\{}()[\]^$+*?.-]/g, (char) => `\\${char}`);
const termsToRegExpString = (terms) => terms.replace(/\s{2,}/g, " ").split(" ").join("|");
const regexpQuery = ({ terms, matchExactly = false }) => {
  if (typeof terms !== "string") {
    throw new TypeError("Expected a string");
  }
  const escapedTerms = escapeRegexp(terms.trim());
  return `(${matchExactly ? escapedTerms : termsToRegExpString(escapedTerms)})`;
};
const buildRegexp = ({ terms, matchExactly = false }) => {
  try {
    const fromString = /^([/~@;%#'])(.*?)\1([gimsuy]*)$/.exec(terms);
    if (fromString) {
      return new RegExp(fromString[2], fromString[3]);
    }
    return new RegExp(regexpQuery({ terms, matchExactly }), "ig");
  } catch {
    throw new TypeError("Expected terms to be either a string or a RegExp!");
  }
};
var regexp_default = buildRegexp;
export {
  regexp_default as default,
  regexpQuery
};
