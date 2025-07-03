import { Component } from "./base-components.js"
import { DragTarget } from "../models/drag-drop.js"
import { Project, ProjectStatus } from '../models/project.js'
import { ItemPosition, ps } from "../state/project-state.js"
import { autobind } from "../decorators/autobind.js"
import { ProjectItem } from "./project-item.js"
import { DataTransferObject } from "./project-item.js"

// ProjectList Class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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

    getProjectItemPostion(targetElement: HTMLLIElement, topOfMovedElement: number): ItemPosition {
        const targetElementCoordinates = targetElement.getBoundingClientRect()

        const { top: topOfTargetElement, height } = targetElementCoordinates
        const middlePointOfTargetElement = (height / 2) + topOfTargetElement

        if (topOfMovedElement >= topOfTargetElement) {
        if (topOfMovedElement <= middlePointOfTargetElement) {
            return ItemPosition.Above
        }
        return ItemPosition.Below
        }
        return ItemPosition.Above
    }


    @autobind
    dropHandler(event: DragEvent): void {    
        let movedProjectItemStr: string;
        if (event.currentTarget && event.dataTransfer) {
        this.listElement.classList.remove('droppable')
        movedProjectItemStr = event.dataTransfer.getData('text/plain')

        // parse the object set in setData
        const movedProjectItemObj = JSON.parse(movedProjectItemStr) as DataTransferObject
        const movedProjectItemId = movedProjectItemObj.projectItemId

        const distanceBtwMouseAndProjectItemTop = movedProjectItemObj.distanceBtwMouseAndProjectItemTop

        const currentMousePosition = event.clientY

        const topOfMovedElement = currentMousePosition + distanceBtwMouseAndProjectItemTop
        
        // if event target id is the same as the unordered list element id
        // if drop target is the UL component (ProjectList)
        if ((event.target as HTMLUListElement).id === this.listElement.id) {
            // this is on the drop zone
            ps.moveProject(movedProjectItemId, this.type)
            return
        }

        
        
        // if drop target is the project Item
        const targetProjectItem = ((event.target as HTMLUListElement).closest('li') as HTMLLIElement)      
        const targetProjectItemId = targetProjectItem.id

        // if the targetProjectItem is the same as the movedProjectItem
        if (targetProjectItemId === movedProjectItemId) {
            event.preventDefault()
        }

        const itemPosition = this.getProjectItemPostion(targetProjectItem, topOfMovedElement)   
        
        ps.moveProject(movedProjectItemId, this.type, targetProjectItemId, itemPosition)

        }
    }

    @autobind
    dragLeaveHandler(_event: DragEvent): void {
        this.listElement.classList.remove('droppable')
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
