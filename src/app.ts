import { ProjectInput } from './components/project-input.js'
import { ProjectList } from './components/project-list.js'
import { ProjectStatus } from './models/project.js';
// import { autobind as Autobind } from './decorators/autobind.js' Autobind will then be used instead
// import * as Validation from './util/validation.ts' Validation.validate will then be used in the file instead
// export default can also be combined with export const in another file, but you can only have one export default

// named exports help maintain a certain naming convention across a team.


new ProjectInput(
  "project-input",
  "app",
  "user-input",
);

new ProjectList(
  "project-list",
  ProjectStatus.Active,
  'app',
  `${ProjectStatus.Active}-projects`
)
new ProjectList(
  'project-list',
  ProjectStatus.Finished,
  'app',
  `${ProjectStatus.Finished}-projects`
)
