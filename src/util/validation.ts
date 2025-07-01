export interface Validation {
    value: string;
    required?: boolean;
    minLength?: number,
    maxLength?: number | undefined;
    min?: number;
    max?: number;
}

export function isFilled (field: string, isRequired: boolean) {
    const trimmedField = field.trim()
    if (isRequired) { 
    if (!trimmedField) {
        alert('Please enter a value')
    }
    return !!trimmedField
    }
    return true
}

export function meetsMinimumLength(value: string, minLength: number): boolean {
    if (value.length < minLength) {
    alert(`This field should be at least ${minLength} characters long`)
    }
    return value.length >= minLength
}

export function validate({ value, minLength, required }: Validation): boolean {
    let isFieldFilled = true;
    let meetsMinLength = true;
    
    if (required) {      
        isFieldFilled = isFilled(value, required)
    }

    // this will allow 0 to pass the minLength test
    if (minLength != null) {
        meetsMinLength = meetsMinimumLength(value, minLength)
    }

    return isFieldFilled && meetsMinLength
}

