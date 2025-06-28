namespace App {
    // enum ProjectStatus {
    //   Active = 'active',
    //   Finished = 'finished'
    // }

    // another way of creating an enum of ProjectStatus is shown below

    export const ProjectStatus = {
        Active: 'active',
        Finished: 'finished'
    }

    export type ProjectStatus = typeof ProjectStatus [keyof typeof ProjectStatus]

    export class Project {
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

}