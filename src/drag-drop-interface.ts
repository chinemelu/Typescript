namespace App {
    // Drag & Drop Interfaces
    // this interface will force classes to implement certain methods
    // The draggable is for the ProjectItems that can be dragged
    export interface Draggable {
        dragStartHandler(event: DragEvent): void
        dragEndHandler(event: DragEvent): void
    }


    // The drag target is for the ProjectList box
    export interface DragTarget {
        dragOverHandler(event: DragEvent): void
        dropHandler(event: DragEvent): void
        dragLeaveHandler(event: DragEvent): void
    }
}