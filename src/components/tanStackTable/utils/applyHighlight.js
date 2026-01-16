import { jsx } from "@emotion/react/jsx-runtime";
import highlightWords from "../highlightWords/highlightWords";
const applyHighlight = (text, query) => {
  const chunks = highlightWords({
    text,
    query: query.join(" ")
  });
  return chunks.map(({ text: text2, match, key }) => match ? /* @__PURE__ */ jsx("mark", { children: text2 }, key) : /* @__PURE__ */ jsx("span", { children: text2 }, key));
};
export {
  applyHighlight
};
