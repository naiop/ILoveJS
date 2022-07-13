/**
 *  sleep
 * @param {*} n 
 */
export function sleep(n) {
  var start = new Date().getTime();
  while (true) if (new Date().getTime() - start > n) break;
}
