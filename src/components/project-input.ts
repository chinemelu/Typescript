import { Component } from "./base-components";
import { Validation, validate } from "../util/validation";
import { autobind } from "../decorators/autobind";
import { ps } from "../state/project-state";

// ProjectInput Class
// this class will be responsible for fetching the input
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    // formSubmitButton: HTMLButtonElement;

    constructor(templateId: string, hostElementId: string, newElementId: string) {
        super(templateId, hostElementId, true, newElementId)
        this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement
        this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement
        this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement
        this.configure()
    }

    configure() {    
        this.element.addEventListener('submit', this.submitHandler)    
    }

    renderContent(): void {
        
    }


    private gatherUserInput(): [string, string, number] | void {
        const title = this.titleInputElement.value
        const description = this.descriptionInputElement.value
        const people = this.peopleInputElement.value

        // if (!title.trim() || !description.trim() || !people.trim()) {
        //   alert('Invalid input, please try again!')
        //   // throw new Error('This suck') this won't trigger the void return type
        //   return; // it is not good to use undefined as a return type but void

        // isValidData(title, description, people) was my own way of validating
        // if (this.isValidData(title, description, people)) { 
        //   return [
        //     title, 
        //     description, 
        //     parseFloat(people)
        //   ]
        // }

        const titleValidatable: Validation = {
        value: title,
        required: true,
        minLength: 5
        }

        const descriptionValidatable: Validation = {
        value: description, 
        required: true, 
        minLength: 5 
        }
        
        const peopleValidatable: Validation = {
        value: people,
        required: true,
        minLength: 1
        }

        if (validate(titleValidatable) && 
            validate(descriptionValidatable) &&
            validate(peopleValidatable)) {
            return [
                title, 
                description, 
                parseFloat(people)
            ]
            }
    }

    private clearAllInputs(...args: HTMLInputElement[]) {
        args.forEach(arg => {
        arg.value = ''
        })
    }

    // my implementation of validation method
    // private thereIsEmptyInput(...args: [ string, string, string ]) {
    //   const thereIsAtLeastOneEmptyInput = args.some(arg => {
    //     return !arg.trim()
    //   })
    //   if (thereIsAtLeastOneEmptyInput) {
    //     alert('Invalid input, please try again!')
    //   }
    //   return thereIsAtLeastOneEmptyInput
    // }

    // my implementation of validation method
    // private thereIsAtLeastOneInvalidtype(...args: [string, string, string]) {
    //   const thereIsAtLeastOneInvalidType = args.some(arg => {
    //     if (typeof arg !== 'string') {
    //       alert('Invalid type. This should be a string')
    //     }
    //   })
    //   return thereIsAtLeastOneInvalidType;
    // }

    // private isValidData(...args: [string, string, string]) {
    //   if (this.thereIsEmptyInput(...args)) {
    //     return false
    //   }
    //   if (this.thereIsAtLeastOneInvalidtype(...args)) {
    //     return false
    //   }
    //   return true
    // }

    @autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const userInput = this.gatherUserInput()
        // tuples here are just arrays in JS
        // The idea of tuple where the number of elements and type of elements is fixed only exists in TypeScript 
        if (Array.isArray(userInput)) {
        const [ title, description, people ] = userInput
        ps.addProject(title, description, people)
        this.clearAllInputs(this.titleInputElement, this.descriptionInputElement, this.peopleInputElement) 
        }
    }
}
