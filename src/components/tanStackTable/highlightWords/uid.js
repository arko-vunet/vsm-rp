let IDX = 36;
let HEX = "";
while (IDX--) {
  HEX += IDX.toString(36);
}
function uid(len = 11) {
  let str = "";
  let num = len;
  while (num--) {
    str += HEX[Math.trunc(Math.random() * 36)];
  }
  return str;
}
export {
  uid as default
};
