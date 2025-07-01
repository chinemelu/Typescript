import { Draggable } from "../models/drag-drop";
import { Component } from '../components/base-components'
import { Project } from '../models/project'
import { autobind } from "../decorators/autobind";

export interface DataTransferObject {
    projectItemId: string;
    distanceBtwMouseAndProjectItemTop: number
}

interface MovableItemCoords {
    top: number;
    bottom: number;
    delta: number;
}

// ProjectItem
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> 
    implements Draggable {
    project: Project
    movableItemCoordinates: MovableItemCoords

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
    this.element.addEventListener('drag', this.dragHandler)
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

    // @autobind
    // dragHandler(event: DragEvent): void {      
    //   if (event.dataTransfer && event.currentTarget) {
    //   }
    // }
    @autobind
    dragStartHandler(event: DragEvent): void {            
    if (event && event.dataTransfer) {
        const projectItemCoordinates = this.element.getBoundingClientRect()
        // get client Y mouse position on dragStart
        const mouseYPosition = event.clientY
        // get movedItem top coordinate on dragStart
        const projectItemTop = projectItemCoordinates.top
        const distanceBtwMouseAndTop = projectItemTop - mouseYPosition
        // set an object into the setData using JSON.stringify
        const dataTransferObject: DataTransferObject = {
        projectItemId: this.element.id,
        distanceBtwMouseAndProjectItemTop: distanceBtwMouseAndTop
        }
        // sending an id will help to get a project from the state and save memory
        // the move dropffect gets an appropriate cursor
        event.dataTransfer.setData("text/plain", JSON.stringify(dataTransferObject));
        event.dataTransfer.effectAllowed = 'move'
    }
    }
    @autobind
    dragEndHandler(_event: DragEvent): void {    
    }

    @autobind
    dragHandler(_event: DragEvent) {
    
    }

    @autobind
    handleDropOnProjectItem(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
        this.element.classList.remove('dragover')
    }
    }

    @autobind
    handleDragoverOnProjectItem(event: DragEvent) {
    // the data is in protected mode in dragover so  event.dataTransfer.getData won't get anything
    // more details here https://stackoverflow.com/questions/31915653/how-to-get-data-from-datatransfer-getdata-in-event-dragover-or-dragenter
    event.preventDefault()    
    this.element.classList.add('dragover')
    }

    @autobind
    handleDragleaveOnProjectItem(_event: DragEvent) {
    this.element.classList.remove('dragover')
    }
}
