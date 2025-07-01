import { ProjectInput } from './components/project-input'
import { ProjectList } from './components/project-list'
import { ProjectStatus } from './models/project';

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
