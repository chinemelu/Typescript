// import helloWorld, { pi, squareTwo, phi, RandomNumberGenerator, absolute  } from './Modules.js'
// import helloWorld, * as math from './Modules.js'
// import type { Cat, Dog } from './Modules.js' // these are types and can be imported using the "type" keyword
// import type { createCatName } from './Modules.js' // cannot import a non Type using "type" keyword
import { createCatName, type Cat, type Dog } from './Modules.js'

// ES Module Syntax with CommonJS Behavior
// const fs = require("fs")
// const code = fs.readFileSync("Module.ts", "utf8")

// console.log('code', code);


// helloWorld()
// console.log('pi', math.pi);
// console.log('squareTwo', math.squareTwo);
// console.log('phi', math.phi);
// console.log('RandomNumberGenerator', math.RandomNumberGenerator);
// console.log('absolute', math.absolute(-2))

export type Animals = Cat | Dog

// const animals: Animals = {
//     breeds: ['Meh'],
//     breed: 'Algorithm',
//     yearOfBirth: 2023
// }

// console.log('createCatName', createCatName());  createCatName cannot be used because it was imported as a type

const catName = createCatName()

console.log('cat name', catName);

// COMMON JS Import Syntax
// const maths = require("./maths")
// const { absolute, squareTwo, phi, pi } = require("./maths")

// console.log('maths')

// Module resolution is the process of taking a string from the "import" or "require" statement, and
// determining what file that string refers to 

// Typescript's module output options - there are 2 options
// "target" - This determines which JS features are downleveled (converted to run in older JavaScript runtimes)
// and which are left intact
// "module" - which determines what code is used for modules to interact with each other
