export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`odihnit ${ms / 1000}sec`);
    }, ms);
  });
}
