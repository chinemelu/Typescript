// Generics

// There are flexible - they are used for creating components that can work with many types, rather than one

function identity<T>(arg: T) {
    return arg
}

// 2 ways of calling identity
let output1 = identity<string>("myString")

// type argument inference - the compiler sets the type for us based on the value of the argument
let output2 = identity("myString")

function identity2<T extends string>(arg: T) {
    return arg
}

function loggingActivity<T>(arg: T[]) {
    return arg
}

// custom types

function identity3<T>(arg: T): T {
    return arg;
  }
   
//   let myIdentity: <Type>(arg: Type) => Type = identity3;

let myIdentity: <T>(arg: T) => T = identity3
let myIdentity2: { <T>(arg: T): T } = identity3;


interface GenericIdentityFn {
    <T>(arg: T): T
}

function identity4<T>(arg: T) {
    return arg
}

let myIdentity3: GenericIdentityFn = identity4


// This makes the parameter visible to all members of the interface
interface GenericIdentityFn2<T> {
    (arg: T): T
}

function identity5<T>(arg: T) {
    return arg;
}

let myIdentity4: GenericIdentityFn2<number> = identity5

// it is not possible to create gneeric enums and namespaces

// Generic Classes

class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T
}   

let myGenericNumber = new GenericNumber<number>();

myGenericNumber.zeroValue = 0
myGenericNumber.add = function(x, y) {
    return x + y
};

let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = 'Meh'
stringNumeric.add = function(x, y) {
    return x + y
}


// there are two types of class instance and static
// only instance classes can be made generic 


// Generic class constraints
function loggingIdentity<T>(arg: T) {    
    return arg 
}

// add constraint
interface Lengthwise {
    length: number;
}

function loggingIdentity2<T extends Lengthwise>(arg: T) {
    return arg
}

loggingIdentity2({ length: 3, value: 3 })


// Using type parameters in Generic Constraints
function getProperty<T extends object, U extends keyof T>(obj: T, key: U) {
    return obj[key]
}

let x = { a: 2, b: 2, c: 3, d: 4, e: 5 }

// console.log('property', getProperty(x, 'e'))

interface Cobject<T> {
    new (): T
}

// Using Class Types in Generics
function create<T>(c: Cobject<T>): T {
    return new c()
}

class BeeKeeper {
    hasMask: boolean = true;
}

class ZooKeeper {
    nametag: string = "Mikle"
}

class Animal {
    numLegs: number = 4;
}

class Bee extends Animal {
    numLegs = 6
    keeper: BeeKeeper = new BeeKeeper()
}

class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper()
}

function createInstance<A extends Animal>(c : new () => A ): A {
    return new c()
}

// console.log('name tag', createInstance(Lion).keeper.nametag);
// console.log('has mask', createInstance(Bee).keeper.hasMask); // this powers mixin pattern

// Generic Parameter Defaults

type Container<T, U> = {
    element: T
    children: U
}

declare function create1(): Container<HTMLDivElement, HTMLDivElement[]>;
declare function create1<T extends HTMLElement>(element: T): Container<T, T[]>;
declare function create1<T extends HTMLElement, U extends HTMLElement>(
    element: T,
    children: U[]
): Container<T, U[]>;

// with generic parameter defaults we can reduce it to:

declare function create2<T extends HTMLElement = HTMLDivElement, U extends HTMLElement[] = T[]>(
    element?: T,
    children?: U
): Container<T, U>;

// const div = create2()
// const div: Container<HTMLDivElement, HTMLDivElement[]> = create2()

// const p = create2(new HTMLParagraphElement());
// const p: Container<HTMLParagraphElement, HTMLParagraphElement[]> = create2()
