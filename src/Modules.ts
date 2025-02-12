// JS community has converged on ES Modules (or ES6 modules.)
// import/export syntax

// This will look at CommonJS and ES2015 code

// any file containing a top-level import or export is considered a module

// a file WITHOUT a top-level import or export is treated as a script whose contents are availabe in the global scope (and therefore to modules as well)

// Modules are executed within their own scope, not in the global scope.
// This means that variables, functions, classes etc. declared in a module are not visible outside the module
// unless they are explicitly exported using one of the export forms.

// Conversely, to consume a variable, function, class, interface etc. exported from a different module, it has to be imported using one of the
// import forms


// ES MODULE SYNTAX
export default function helloWorld() {
    console.log("Hello world!");
}

export var pi = 3.14;
export let squareTwo = 1.41;
export const phi = 1.61;

export class RandomNumberGenerator {}

export function absolute(num: number) {
    if (num < 0) return num * -1;
    return num;
}

// Typescript specific ES Module Syntax

export type Cat = { breed: string; yearOfBirth: number }

export type Dog = {
    breeds: string[];
    yearOfBirth: number;
}
// export interface Dog {
//     breeds: string[];
//     yearOfBirth: number;
// }

export const createCatName = () => "fluffy"

// ES Module Syntax with CommonJS Behavior
// const fs = require("fs")
// const code = fs.readFileSync("Module.ts", "utf8")

// console.log('code', code);


// COMMONJS SYNTAX
// function absolute(num: number) {
//     if (num < 0) return num * -1;
//     return num;
// }

// module.exports = {
//     pi: 3.14,
//     squareTwo: 1.41,
//     phi: 1.61,
//     absolute,
// }


