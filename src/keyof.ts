// The keyof type operator
// This takes an object type and produces a string or numeric literal union of its keys.

type Point = {
    x: number,
    y: number
}

type P = keyof Point;

function ObjectWithXandYProperties(obj: Point, x: P ) {
    return obj[x] // it will work because x is a keyof Point
}

// if the type has a string or number index signature, keyof will return those types instead

type Arrayish = {
    [n: number] : unknown
}

type A = keyof Arrayish

type Mapish = {
    [k: string]: boolean
}

type M = keyof Mapish

// it's string | number in M because in JavaScript object keys are always coerced to a string
// so obj[0] is always the same as obj["0"]
// keyof types become especially useful when combined with mapped types, which we'll learn more
// about later