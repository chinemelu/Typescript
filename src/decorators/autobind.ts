export function autobind(_1: any,  _2: string, descriptor: PropertyDescriptor) {
    const propDescriptor: PropertyDescriptor = {
        get() { 
            const boundFunction = descriptor.value   
            return boundFunction.bind(this)
        }
    }
    return propDescriptor
} 
