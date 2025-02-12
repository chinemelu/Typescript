



class Greeter {
    readonly name: string = "world";
   
    constructor(otherName?: string) {
      if (otherName !== undefined) {
        this.name = otherName;
      }
    }
    // err() {
    //   this.name = "not ok";
    // }
  }
  const g = new Greeter();
//   g.name = "also not ok";


// SUPER CALLS

class Base {
    k = 4
}

class Derived extends Base {
    constructor() {
        // super must be called before accessing 'this' in the constructor of a derived class.
        super()
        // console.log("k", this.k);
    }
}

new Derived()


// Getters and Setters 
// Classes can also have accessors 

class C {
    _length = 0;

    get length() {
        return this._length
    }

    set length(value: number) {
        this._length = value
    }
}

let c = new C()

// console.log('c\'s previous length', c.length)

c.length = 5

// console.log('c\'s new length', c.length)



// Index signatures

interface Obrigado {
    (s: string): boolean
}

class MyClass {
    [s: string]: boolean | ((s: string) => boolean)
    meh: true
    check(s: string) {
        // console.log(
        //     'meh', s, this[s]
        // )
        return this[s] as boolean
    }
}




// this = {
//     s: true,
//     b: (k: string) => true
// }

const myClass = new MyClass()

// myClass.s = true
// myClass.s = 
// console.log('check my class', myClass.check('meh'))


