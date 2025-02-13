// The Typeof type operator
// JavaScript already has a typeof operator you can use in an expression context
console.log(typeof "Hello world") // prints string

// Typescript adds a typeof operator you can use in a type context to refer to the type of a
// variable or property

let s = "hello";
let n: typeof s; // let n: string

type Predicate = (x: unknown) => boolean;

// ReturnType is built in
type K = ReturnType<Predicate>

function f() {
    return { x: 10, y: 3 }
}

// type U = ReturnType<f>
// remember that values and types aren't the same thing. To refer to the type that the value f has
// we use typeof 

type U = ReturnType<typeof f> //  type U = { x: number; y: number }

// Typescript intentional limits the sorts of expressions you can use typeof on
// it is only legal to use typeof on identifier (i.e variable names) or their properties

// eg
let msgbox: (n: string) => boolean
// Meant to use = ReturnType<typeof msgbox>
// but used let shouldContinue: typeof msgbox("Are you sure you want to continue?"); which throws an error
let shouldContinue: ReturnType<typeof msgbox>;
