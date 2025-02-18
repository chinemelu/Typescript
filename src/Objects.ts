
interface Person1 {
  age: number;
  name: string;
}

// type alias
type Person3 = {
  name: string;
  age: number;
}

function greet(person: Person3) {
  console.log("Hello " + person.name);
  
  return "Hello " + person.name
}

greet({ name: 'Tony', age: 20 })

// Property modifiers

enum Shape {
  rectangle = 'rectangle'
}

interface PaintOptions {
  shape: Shape;
  xPos?: number;
  yPos?: number;
}

function getShape(x: Shape): Shape {
  return x
}

function paintShape(opts: PaintOptions) {
  let xPos = opts.xPos
  let yPos = opts.yPos

  xPos = xPos === undefined ? 0 : xPos
  yPos = yPos === undefined ? 0 : yPos
  return { xPos, yPos }
}

const shape = getShape(Shape.rectangle);

paintShape({ shape })
paintShape({ shape, xPos: 500 })
paintShape({ shape, yPos: 20 })
paintShape({ shape, xPos: 100, yPos: 100 })

function paintShape1({ shape, xPos = 0, yPos = 0}: PaintOptions) {
  console.log("x coordinate at", xPos);
  console.log("y coordinate at", yPos); 
  return { xPos, yPos, shape }
}

// readonly properties
interface SomeType {
  readonly prop: string
}

function doSomething(obj: SomeType) {
  console.log(`prop has the value '${obj.prop}'.`);
  // obj.prop = 'hello' will throw an error due to the readonly modifier
}

// even with the readonly modifier, properties in a readonly object property can be changed

interface Home {
  readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
  // we can read and upadte properties from 'home.resident'.
  console.log(`Happy birthday ${home.resident.name}`);
  home.resident.age++
}

function evict(_home: Home) {
  /** * home.resident = {
        name: 'Victor the Evictor',
        age: 42
    } 
    however you cannot assign to 'resident' 
    because the property itself is a read-only property
  */
}

interface Person4 {
  name: string;
  age: number;
}

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

let writablePerson: Person4 = {
  name: 'Person McPersonface',
  age: 20
}

// works
let readonlyPerson: ReadonlyPerson = writablePerson

console.log(readonlyPerson.age); // prints 20
writablePerson.age++
console.log(readonlyPerson.age); // prints 21

// Index Signatures
// Sometimes you don’t know all the names of a type’s properties ahead of time, but you do know the shape of the values.

// In those cases you can use an index signature to describe the types of possible values, for example:

interface StringArray {
  [index: number]: string;
}

function getStringArray(): StringArray {
    return [
        '2',
        '3',
        '4',
        '5'
    ]
}
 
const myArray: StringArray = getStringArray();

let secondItem = myArray[1];

// The StringArray interface has an index signature. The index signature states that when 
// StringArray is indexed with a nunber, it will return a string

// Only some types are allowed for index signature properties: "string", "number", "symbol", template
// string patterns and union types consisting only of these

// string index signatures describe the "dictionary" pattern and also enfroce that all properties match 
// their return type.

// string index declares that obj.property is also available as obj["property"].

interface NumberDictionary {
  [index: string]: number;
  length: number;
  // name: string; this throws an error Property 'name' of type 'string' is not assignable to 
  // 'string' index type 'number'.
}

// however properties of different types are acceptable if the index signature is a union of the
// property types

interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number;
  name: string
}

// You can make index signatures readonly in order to prevent assignment to their indices

interface ReadonlyStringArray {
  readonly [index: string]: number;
  length: number
}

const realBoy: ReadonlyStringArray = {
  ayo: 200,
  thrift: 100,
  length: 3
}

// realBoy.thrift = 3 this throws an error because thrift is part of the index signature
// realBoy. ayo = 100 throws an error for the same reason
// however realBoy.length will not throw an error because the length preoperty is not read only

// interface ReadonlyStringArray2 {
//   readonly [index: number]: string;
// }

// function getReadOnlyStringArray(): ReadonlyStringArray2 
 
// let myArray: ReadonlyStringArray2 = getReadOnlyStringArray();
// myArray[2] = "Mallory";

// Index signature in type "ReadonlyStringArray" only permits reading.


// Excess Property Checks
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || 'red',
    area: config.width ? config.width * config.width : 20
  }
}

// let mySquare = createSquare({ colour: 'red', width: 100  })  this will throw an error
// because colour is not in SquareConfig interface but color.


// Getting around these checks is actually really simple. 
// The easiest method is to just use a type assertion

let mySquare = createSquare({ opacity: 0.5, color: 'red' } as SquareConfig);

// However the best approach may be to add a string index signature if you are sure
// that the object can have some extra properties that are used in some special way.

interface SquareConfig {
  color? : string;
  width?: number;
  [ propName: string  ] : unknown
}

// here we are saying that SquareConfig can have any number of properties, and as long as they aren't
// color or width, their types don't matter

let squareOptions = { colour: 'red', width: 100}
let mySquare2 = createSquare(squareOptions)

// the above work around will work as long as you have a common property between SquareOptions and 
// SquareConfig. In this example, the common property is width. It will fail otherwise e.g

let squareOptions2 = { colour: 'red' }

let mySquare3 = createSquare(squareOptions2) // this will throw Type { colour: string } has no properties
// in common with type 'SquareConfig'

