// Indexed Access Types
// We can use an indexed access type to look up a specific proepty on another type

type Person = {
    age: number;
    name: string;
    alive: boolean
}

type Age = Person["age"]

// The indexing type is itself a type so we can use unions, keyof, or other types entirely

type I1 = Person["age" | "name"] // type I1 = string | number

type I2 = Person[keyof Person] // type I2 = string | number | boolean

type AliveOrName = "alive" | "name";

type I3 = Person[AliveOrName] // type I3 = string | boolean

// you will see an error if you try to andex a property that does not exist

// type I4 = Person['alve'] Property 'alve' does not exist on type "Person"

// Another example of indexing with an arbitrary type is using number to get
// the type of an array's elements
// We can combine this with typeof to conveniently capture the element type of an array literal

const MyArray = [
    { name: 'Alice', age: 15 },
    { name: 'Bob', age: 23 },
    { name: 'Eve', age: 38 }
]

type Person2 = typeof MyArray[number] // type Person = { name: string, age: number }

type Age2 = typeof MyArray[number]["age"] // type Age2 = number

type Age3 = Person2["age"] // type Age3 = number

// You can only use types when indexing, meaning you can't use a const to make a variable reference;

// const key = "age"
// type Age4 = Person2[key] // Type 'key' cannot be used as an index type.
// 'key' refers to a value, but is being used as a type here

// However, you can use a type alias for a similar style of refactor:
type key = "age"
type Age4 = Person2[key]
