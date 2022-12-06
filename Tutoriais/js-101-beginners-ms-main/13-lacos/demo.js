/**
 * file: demo.js
 * data: 10/07/2021
 * description: arquivo responsável para ensinar uso de laços em JavaScript
 * author: Glaucia Lemos <twitter: @glaucia_lemos86>
 */

const names = ["Justin", "Sarah", "Christopher"];

// while loop
console.log("-- while --");
let index = 0;
while (index < names.length) {
  const name = names[index];
  console.log(name);
  index++;
}

// for loop
console.log("-- for --");
for (let index = 0; index < names.length; index++) {
  const name = names[index];
  console.log(name);
}

// for of
console.log("-- for of --");
for (let name of names) {
  console.log(name);
}
