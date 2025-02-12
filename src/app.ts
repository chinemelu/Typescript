// enum ProjectStatus {
//   Active = 'active',
//   Finished = 'finished'
// }

// another way of creating an enum of ProjectStatus is shown below


class State<T> {
  // protected is similar to private but it is accessible in every inherited class
  protected listeners: Listeners<T>[]
  constructor() {
    this.listeners = []
  }
  addListener(listenerFn: Listeners<T>) {
    this.listeners.push(listenerFn)
  }
}

enum insertPosition {
  BeforeEnd = 'beforeend',
  AfterBegin = 'afterbegin'
}

const ProjectStatus = {
  Active: 'active',
  Finished: 'finished'
}

type ProjectStatus = typeof ProjectStatus [keyof typeof ProjectStatus]

class Project {
  constructor(
    public id: string,
    public title: string, 
    public description: string, 
    public people: number,
    public status: ProjectStatus
  ) 
  {
    
  }
}

type Listeners<T> = (proj: T[]) => void

// Project State Management
class ProjectState extends State<Project> {
  private projects: Project[] = []
  private static instance: ProjectState;
  
  // private constructor will ensure that it is a single class
  private constructor() {
    super()
  }

  // this ensures that there is only one single instance of this class
  static getInstance() {
    if (this.instance) {
      return this.instance
    }
    this.instance = new ProjectState()
    return this.instance
  }

  // addListener(listenerFn: Listeners) {
  //   this.listeners.push(listenerFn)
  // }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    )
    this.projects.push(newProject)
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const ps = ProjectState.getInstance()

// add autobind decorator
// A decorator is a function (function declaration or expressions)

interface Value {
  title: string;
  description: string;
  people: string
}

// type can also be used here
interface Validation {
  value: string;
  required?: boolean;
  minLength?: number,
  maxLength?: number | undefined;
  min?: number;
  max?: number;
}

// component Base Class
// you make it abstract because you don't ever want it to be instantiated
// by making the attach and configure methods abstract, you want them to be implemented
// in their base classes
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

// ProjectItem
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  project: Project

  get peopleAssignedText() {
    return this.project.people > 1 ? 'people' : 'person'
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id)
    this.project = project
    this.configure()
    this.renderContent()
  }

  configure() {
    window.addEventListener("DOMContentLoaded", () => {
      this.element.draggable = true

      // if (this.element) {
      //   this.element.addEventListener('dragstart', (evt) => {
      //     if (evt.dataTransfer && evt.target) {
      //       evt.dataTransfer.setData("text/html", evt.target);
      //       evt.dataTransfer.dropEffect = "move";
      //     }
      //   })
      // }

      if (this.hostElement) {
        this.hostElement.addEventListener('dragover', (evt) => {
          evt.preventDefault()
        })

        // this.hostElement.addEventListener('drop', (evt) => {
        //   if (evt.target && evt.dataTransfer) {
        //     // Get the id of the target and add the moved element to the target's DOM
        //     const data = evt.dataTransfer.getData("text/plain");
        //     evt.target.appendChild(document.getElementById(data))
        //   }
        // })
      }
    })
    
  }

  renderContent(): void {
    const h2El = this.element.querySelector('h2') as HTMLHeadingElement
    const h3El = this.element.querySelector('h3') as HTMLHeadingElement
    const paragraphEl = this.element.querySelector('p') as HTMLParagraphElement

    const { title, description, people } = this.project
    h2El.textContent = title
    h3El.textContent = description
    paragraphEl.textContent = `${people.toString()} ${this.peopleAssignedText} assigned`
  }
}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[] = []

  // private type is a shortcut for adding the property at the top
  constructor(templateId: string, private type: ProjectStatus, hostElementId: string, newElementId: string) { // you could also do this -   constructor(private type: 'active' | 'finished') 
    super(templateId, hostElementId, false, newElementId)   
    this.type = type
    this.configure()
    this.renderContent()
  }

  configure() {
    this.assignedProjects = []
    ps.addListener((projects: Project[]) => { 
      projects = projects.filter(project => project.status === this.type)
      this.assignedProjects = projects
      this.renderProjects()
    });
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-projects-list`) as HTMLElement
    // another way of doing it is listEl.innerHTML = ''
    while(listEl.hasChildNodes()) {
      listEl.removeChild(listEl.lastChild as HTMLElement)
    }
    for (const item of this.assignedProjects) {
      new ProjectItem(
        `${this.type}-projects-list`,
        item
      )
    }
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    (this.element.querySelector("ul") as HTMLUListElement).id = listId;
    (this.element.querySelector("h2")! as HTMLHeadingElement).textContent = this.type.toUpperCase() + ' PROJECTS';
    (this.element.querySelector("h2") as HTMLHeadingElement).style.color = "white"
  }
}

function autobind(_1: any,  _2: string, descriptor: PropertyDescriptor) {
  const propDescriptor: PropertyDescriptor = {
    get() { 
      const boundFunction = descriptor.value   
      return boundFunction.bind(this)
    }
  }
  return propDescriptor
} 

// ProjectInput Class
// this class will be responsible for fetching the input
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

    if (this.validate(titleValidatable) && 
        this.validate(descriptionValidatable) &&
        this.validate(peopleValidatable)) {
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

  private isFieldFilled (field: string, isRequired: boolean) {
    const trimmedField = field.trim()
    if (isRequired) { 
      if (!trimmedField) {
        alert('Please enter a value')
      }
      return !!trimmedField
    }
    return true
  }

  private meetsMinLength(value: string, minLength: number): boolean {
    if (value.length < minLength) {
      alert(`This field should be at least ${minLength} characters long`)
    }
    return value.length >= minLength
  }

  private validate({ value, minLength, required }: Validation): boolean {
    let isFieldFilled = true;
    let meetsMinLength = true;
    
    if (required) {      
      isFieldFilled = this.isFieldFilled(value, required)
    }

    // this will allow 0 to pass the minLength test
    if (minLength != null) {
      meetsMinLength = this.meetsMinLength(value, minLength)
    }

    return isFieldFilled && meetsMinLength
  }
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

const newProject = new ProjectInput(
  "project-input",
  "app",
  "user-input",
);



const projectList = new ProjectList(
  "project-list",
  ProjectStatus.Active,
  'app',
  `${ProjectStatus.Active}-projects`
)
const finishedProjectList = new ProjectList(
  'project-list',
  ProjectStatus.Finished,
  'app',
  `${ProjectStatus.Finished}-projects`
)
