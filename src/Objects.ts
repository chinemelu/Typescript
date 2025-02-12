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

// console.log('1', secondItem)
// const secondItem: string