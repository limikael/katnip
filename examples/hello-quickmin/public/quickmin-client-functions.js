async function helloFunc({ id, item }) {
  console.log("hello!!! id=", id, "item=", item);
  await new Promise((r) => setTimeout(r, 1e3));
  return "done and done";
}
export {
  helloFunc
};
