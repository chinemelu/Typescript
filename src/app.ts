// Drag & Drop Interfaces
// this interface will force classes to implement certain methods
// The draggable is for the ProjectItems that can be dragged
interface Draggable {
  dragStartHandler(event: DragEvent): void
  dragEndHandler(event: DragEvent): void
}

// The drag target is for the ProjectList box
interface DragTarget {
  dragOverHandler(event: DragEvent): void
  dropHandler(event: DragEvent): void
  dragLeaveHandler(event: DragEvent): void
}


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

  addProject(title: string, description: string, numOfPeople: number, type: ProjectStatus = ProjectStatus.Active, projectId?: string) {
    const newProject = new Project(
      projectId ? projectId: Math.random().toString(),
      title,
      description,
      numOfPeople,
      type
    )
    this.projects.push(newProject)
    this.updateListeners()
  }

  moveProject(movedProjectItemId: string, status: ProjectStatus, targetProjectItemId?: string) {
    const movedProjectItemIndex: keyof Project[] = this.projects.findIndex(project => project.id === movedProjectItemId) 
    const movedProject = this.projects[movedProjectItemIndex]
    const targetProjectItemIndex: keyof Project[] = this.projects.findIndex(project => project.id === targetProjectItemId)
    const targetProject = this.projects[targetProjectItemIndex]    

    if (movedProject) {      
      if (movedProject.status === status) {
        if (targetProjectItemIndex !== movedProjectItemIndex) {
          this.projects[targetProjectItemIndex] = movedProject
          this.projects[movedProjectItemIndex] = targetProject
          this.updateListeners()
        }
        return
      }
      movedProject.status = status
      this.updateListeners()
    }
  }

  private updateListeners() {
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
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> 
  implements Draggable {
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
    this.element.draggable = true
    this.element.addEventListener('dragstart', this.dragStartHandler)
    this.element.addEventListener('dragend', this.dragEndHandler)
    this.element.addEventListener('drop', this.handleDropOnProjectItem)
    this.element.addEventListener('dragover', this.handleDragoverOnProjectItem)
    this.element.addEventListener('dragleave', this.handleDragleaveOnProjectItem)

    if (this.hostElement) {
      this.hostElement.addEventListener('dragover', (evt) => {
        evt.preventDefault()
      })
    }    
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

  @autobind
  dragStartHandler(event: DragEvent): void {    
    if (event.dataTransfer && event.currentTarget) {
      // sending an id will help to get a project from the state and save memory
      // the move dropffect gets an appropriate cursor
      event.dataTransfer.setData("text/plain", this.element.id);
      event.dataTransfer.effectAllowed = 'move'
    }
  }
  @autobind
  dragEndHandler(_event: DragEvent): void {
  }

  @autobind
  handleDropOnProjectItem(event: DragEvent) {
    // const elementId = event.dataTransfer?.getData('text/plain')
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      this.element.classList.remove('dragover')
    }
  }

  @autobind
  handleDragoverOnProjectItem(event: DragEvent) {
    // the data is in protected mode in dragover so  event.dataTransfer.getData won't get anything
    // more details here https://stackoverflow.com/questions/31915653/how-to-get-data-from-datatransfer-getdata-in-event-dragover-or-dragenter
    event.preventDefault()    
    const targetElementId = (event.target as HTMLElement).id;
    if (event.currentTarget && targetElementId !== this.element.id) {
      this.element.classList.add('dragover')
    }
  }

  @autobind
  handleDragleaveOnProjectItem(_event: DragEvent) {
    this.element.classList.remove('dragover')
  }
}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProjects: Project[] = []
  listElement: HTMLUListElement

  // private type is a shortcut for adding the property at the top
  constructor(templateId: string, private type: ProjectStatus, hostElementId: string, newElementId: string) { // you could also do this -   constructor(private type: 'active' | 'finished') 
    super(templateId, hostElementId, false, newElementId)   
    this.type = type
    this.listElement = this.element.querySelector("ul") as HTMLUListElement
    this.configure()
    this.renderContent()
  }

  @autobind
  dragOverHandler(event: DragEvent): void {
    // event.preventDefault() allows a drop event to take place
    // the default prevents dropping
    // if there is a dataTransfer that has the text/plain type allow the drop (event.preventDefault())
    if (event.dataTransfer) {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move";
      this.listElement.classList.add('droppable')
    }
  }


  @autobind
  dropHandler(event: DragEvent): void {    
    let movedProjectItemId: string;
    if (event.currentTarget && event.dataTransfer) {
      this.listElement.classList.remove('droppable')
      movedProjectItemId = event.dataTransfer.getData('text/plain')
      
      // if event target id is the same as the unordered list element id
      if ((event.target as HTMLLIElement).id === this.listElement.id) {
        // this is on the drop zone
        ps.moveProject(movedProjectItemId, this.type)
        return
      }

      const targetProjectItemId = ((event.target as HTMLUListElement).closest('li') as HTMLLIElement).id
      const listElements = (event.currentTarget as HTMLUListElement).getElementsByTagName('li')
      const targetElementIsInListElements = Array.from(listElements).some((elem) => {
        return elem.id === targetProjectItemId
      })

      if (targetElementIsInListElements) {        
        ps.moveProject(movedProjectItemId, this.type, targetProjectItemId)
      }

    }
  }

  @autobind
  dragLeaveHandler(_event: DragEvent): void {
    // if (this.listElement.classList.contains('droppable')) {
      this.listElement.classList.remove('droppable')
    // }
  }

  configure() {
    this.listElement.addEventListener('dragover', this.dragOverHandler)
    this.listElement.addEventListener('dragleave', this.dragLeaveHandler)
    this.listElement.addEventListener('drop', this.dropHandler)

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
