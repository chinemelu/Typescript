
import { insertPosition } from "../state/project-state"

// component Base Class
// you make it abstract because you don't ever want it to be instantiated
// by making the attach and configure methods abstract, you want them to be implemented
// in their base classes
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement
    hostElement: T
    element: U
    insertAtStart: boolean

    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
        this.templateElement = document.getElementById(templateId) as HTMLTemplateElement
        this.hostElement = document.getElementById(hostElementId) as T
        const importedNode = document.importNode(this.templateElement.content, true)
        this.element = importedNode.firstElementChild as U
        this.insertAtStart = insertAtStart

        if (newElementId) {
        this.element.id = newElementId
        }

        this.attach()
    }

    attach() {
        this.hostElement.insertAdjacentElement(this.insertAtStart ? insertPosition.AfterBegin : insertPosition.BeforeEnd, this.element)
    }

    // private modifier cannot be used with abstract keyword because private denotes that the method cannot be used 
    // outside of the class
    abstract configure(): void
    abstract renderContent(): void
}

