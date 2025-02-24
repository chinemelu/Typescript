
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

// EXTENDING TYPES

interface BasicAddress {
  name? : string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

// interface AddressWithUnit {
//   name?: string;
//   unit: string;
//   street: string;
//   city: string;
//   country: string;
//   postalCode: string
// }

// another way to write the above
interface AddressWithUnit extends BasicAddress {
  unit: string;
}

function ShowAddressWithUnit (): AddressWithUnit {
  return {
    name: '',
    unit: '',
    street: '',
    city: '',
    country: '',
    postalCode: ''
  }
}

// the extends keyword on an interface allows us to effectively copy members from other named types, 
// and add whatever new members we want.

// interfaces can also extend from multiple types

interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

// interface ColorfulCircle extends Circle, Colorful {} This also works

const cc: ColorfulCircle = {
  color: 'red',
  radius: 5
}

// Intersection Types
// Typescript provides another construct called intersection types that is mainly used 
// to combine existing object types

// An intersection type is defined using the & operator
interface Colorful2 {
  color: string;
}

interface Circle2 {
  radius: number;
}

type ColorfulCircle2 = Colorful2 & Circle2;

function draw(circle: ColorfulCircle2) {
  console.log(`Color was ${circle.color}`);
  console.log(`Radius was ${circle.radius}`);
}

draw({ color: 'red', radius: 20 }) // ok
// draw({ color: 'red', raidus: 42 }) this throws an error (Object literal may only 
// specify known properties, but 'raidus' does not exist in type 'Colorful & Circle'. 
// Did you mean to write 'radius'?) because raidus is an unknown property
// of ColorfulCircle2


// Interface Extension vs Intersection
// The difference between the two lies in the way they behave if there are incompatible types
// in the same declaration e.g

// if an interface is declared with same with compatible properties, there will be no error 
// and typescript will attempt to merge them.

// if the properties are not compatible (i.e they have the same property name but different types)
// Typescript will raise an error

interface Person5 {
  name: string
  class: string
}

interface Person5 {
  name: string;
  age: string;
}

const person5: Person5 = {
  name: '',
  age: '',
  class: '' // if class is not added it causes an error as typescript has merged 
  // both declarations of Person5 to contain class as a property
}
// There will be no error above even though there's an extra property

// interface Person4 {
//   name: number 
// }

// This will throw an error due to the first one requiring a property 
// with a type of string whilst Person4  has a type number

interface Person6 {
  name: string;
}

interface Person7 {
  name: number;
}

type Staff = Person6 & Person7

// declare const staffer: Staff;
// staffer.name; 
// because the Staff type requires the name property to be both a string and a number, this results in the 
// property being of type never



// GENERIC OBJECT TYPES
// if a box type can contain any value - strings, numbers, Giraffes, whatever

interface Box1 {
  contents: any
}

// the any type can lead to accidents down the line
// unknown will offer better typing than any because it's more restrictive
// however it will require precautionary checks in the event that you know the type of contents
// or the use of error-prone type assertions

interface Box2 {
  contents: unknown;
}

let b: Box2 = {
  contents: "hello world"
}

// b.contents could be checked 

if (typeof b.contents === 'string') {
  console.log(b.contents.toLowerCase());
}

// or a type assertion could be used
console.log((b.contents as string).toLowerCase());

// One type safe approach would be to instead scaffold out different Box types for every type of contents

interface NumberBox {
  contents: number
}

interface StringBox {
  contents: string;
}

interface BooleanBox {
  contents: boolean
}

// But that means that different functions or overloads of functions, will have to be
// created to operate on these types

function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
  box.contents = newContents
}

// this impractical and in the future more types and overloads may need to be introduced
// which will lead to messy code and frustration for the developers.


// Culminating in a Generic object type

interface Box3<T> {
  contents: T
}

// This could be read as "A box3 of T is something who contents have type T". Later on, when Box3
// is referred to, it will be given a type argument in place of T

let b3: Box3<string>;

// when typescript sees Box<string>, it will replace every instance of T in Box<T> with string

let b4: Box3<string> = {
  contents: "Hello"
}

b4.contents // prints string type

// an interface can be put as Type
interface Apple {
  // ...
  a: string
}

let b6: Box3<Apple> = {
  contents: {
    a: 'Apple'
  }
}

// This also means that overloads can be avoided entirely and instead
// generic functions could be used

function setContents2<T>(box: Box3<T>, newContents: T) {
  return box.contents = newContents
}

const box = {
  contents: ''
}

setContents2<string>(box, 'yoo')

// it is worth noting that type aliases can also be generic

type Box<T> = {
  contents: T
};

// since type aliases, unlike interfaces, can describe more than just object types,
// we can also use them to write other kinds of generic helper type

type orNull<T> = T | null
type OneOrMany<T> = T | T[]
type OneOrManyOrNull<T> = orNull<OneOrMany<T>>
type OneOrManyOrNullStrings = OneOrManyOrNull<string>

// The array type
// whenever you do string[] or number[], they are the short forms of Array<string> and Array<number>

function doSomething2(_value: Array<string>) {
  //..
}

let myArray2: string[] = ['hello', 'world'];

doSomething2(myArray2);
doSomething2(new Array('hello', 'world'))


interface Array<T> {
  /* 
    Gets or sets the length of an array;
  */
 length: number

   /**
   * Removes the last element from an array and returns it.
   */
   pop(): T | undefined;
 
   /**
    * Appends new elements to an array, and returns the new length of the array.
    */
   push(...items: T[]): number;
   // ...
}

// Map, Set and Promises are also generic as because of the way they work, they can work with any type


// ReadonlyArray
// The ReadonlyArray is a special type that describes arrays that shouldn't be changed

function doStuff(value: ReadonlyArray<string>) {
  // we can copy from value
  const copy = value.slice()
  console.log('copy', copy);
  

  // however we cannot mutate values
  // value.push('yoo') will throw an error
}

// You can only assign ReadonlyArray and not construct it
const roArray: ReadonlyArray<string> = ["red", "green", "blue"]

// Just as Typescript offers a short hand of T[] for Array<T>, it also offers readonly string[]
// for ReadonlyArray<string>

const strArray: readonly string[] = ['22', 'a', 'true']

// unlike the readonly property modifier, assignability isn’t bidirectional between regular Arrays and ReadonlyArrays.

let rs: readonly string[] = [];
let os: string[] = [];
 
rs = os;
os.push('meh')

console.log('rs', rs);

// os = rs; this will throw an error

// Tuple Type
// A tuple type is another sort of array that knows exactly how many elements it contains
// and exactly which types it contains at specific positions

type StringNumberPair = [string, number]

function doSomething3(_pair: StringNumberPair) {
  // const a = pair[0] a will be a string

  // const b = pair[1] b will be a number

  // const c = pair[2] this will throw an error because it exceeds the number of 
  // elements specified

 
}

doSomething3(['hello', 223])


 // Tuples can be destructured using JavaScript’s array destructuring.

function doSomething4(stringHash: StringNumberPair) {
  const [inputString, hash] = stringHash;
  console.log('inputString', inputString);                   
  console.log('hash', hash);             
}

doSomething4(['2000', 2000])


interface StringNumberPair2 {
  length: 2;
  0: string;
  1: number;

  // other "Array<string | number>" members ...
  slice(start? : number, end?: number): Array<string | number>;
}

// Tuples can have optional properties by writing out a question mark (? after an element's type)
// Optional tuple elements can only come at the end and also affect the type of length


type Either2dOr3d = [number, number, number?]

function setCoordinate(_coord: Either2dOr3d) {
  // const [x, y, z] = coord  z will show as number|undefined
  // console.log(`Provided coordinates had ${coord.length} dimnesions`);  length will show 2|3 
  // because of the optional property
} 

// Tuples can also have rest elements, which have to be an array/tuple type.

type StringNumberBooleans = [string, number, ...boolean[]]
type StringBooleansNumber = [string, ...boolean[], number]
type BooleansStringNumber = [...boolean[], string, number]


const stringNumberBooleans: StringNumberBooleans = ['a', 3] // this will work because rest elements can be empty
const stringNumberBooleans2: StringNumberBooleans = ['a', 3, true, true, false, false]

// optional and rest elements allow TypeScript to correspond tuples with parameter lists. 
// Tuples type can be used in rest parameters and arguments so that the following


function readButtonInput(...args: [string, number, ...boolean[]]) {
  // const [name, version, ...input] = args;
  // ...
}

// is basically equivalent to

function readButtonInput2(_name: string, _version: number, ..._input: boolean[]) {
  //...
}

// This is handy when you want to take a variable number of arguments with a rest parameter 
// and you need a minimum number of elements, but you don't want to introduce intermediate 
// variables

// readonly Tuple Types
// tuple types have readonly variants and can be specified by sticking a readonly modifier in front of them

function doSomething5(pair: readonly [string, number]) {
  // ...
  // Writing a property to a readonly tuple is not allowed
  // pair[0] = 2 this will throw an error because writing a property to a readonly tuple is not
  // allowed
  // Cannot assign to '0' because it is a read-only property.

}


// Array literals with const assertions will be inferred with readonly tuple types
// e.g

const point = [3, 4] as const
// point[0] = 1 this will throw an error as it is readonly

function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x**2 + y**2)
}

// distanceFromOrigin(point)  this will throw an error because point is immutable and 
// distanceFromOrigin expects a mutable tuple

// Since point’s type was inferred as readonly [3, 4], it won’t be compatible 
// with [number, number] since that type can’t guarantee point’s elements won’t be mutated.