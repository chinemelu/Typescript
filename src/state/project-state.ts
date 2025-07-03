import { Project, ProjectStatus } from "../models/project.js"

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

export enum ItemPosition {
  Above = 'above',
  Below = 'below'
}

export enum insertPosition {
  BeforeEnd = 'beforeend',
  AfterBegin = 'afterbegin'
}

type Listeners<T> = (proj: T[]) => void

// Project State Management
export class ProjectState extends State<Project> {
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

  changeProjectPosition(movedProjectItemIndex: number, targetProjectItemIndex: number, movedProject: Project, movedItemNewPosition: ItemPosition) {    
    this.projects.splice(movedProjectItemIndex, 1)
    if (movedItemNewPosition === ItemPosition.Above) {
      // add the moved project in the position of the target project
      this.projects.splice(targetProjectItemIndex, 0, movedProject)
    } else {
      // add the moved project to a lower position than the target project
      this.projects.splice(targetProjectItemIndex + 1, 0, movedProject )
    }
  }

  moveProject(movedProjectItemId: string, status: ProjectStatus, targetProjectItemId?: string, movedItemNewPosition?: ItemPosition) {
    const movedProjectItemIndex: keyof Project[] = this.projects.findIndex(project => project.id === movedProjectItemId) 
    const movedProject = this.projects[movedProjectItemIndex]
    const targetProjectItemIndex: keyof Project[] = this.projects.findIndex(project => project.id === targetProjectItemId)
    // there are 3 possibilities 
    // 1 - the user is dragging project Item between Active Projects and Finished Projects ProjectList
    // 2 - the user is dragging project item between a ProjectList (either Active or Finished ProjectList)
    if (movedProject) { 
      movedProject.status = status
      // if within the same ProjectList     
      if (movedItemNewPosition) {        
        if (targetProjectItemIndex !== movedProjectItemIndex) {
          // remove movedItem from position
          this.changeProjectPosition(movedProjectItemIndex, targetProjectItemIndex, movedProject, movedItemNewPosition)
        }
      }
      this.updateListeners()
    }
  }

  private updateListeners() {
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

export const ps = ProjectState.getInstance()