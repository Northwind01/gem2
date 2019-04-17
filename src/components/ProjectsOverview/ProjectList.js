import React from 'react';

import ProjectItem from './ProjectItem';

const ProjectList = ({
  authUser,
  projects,
  onEditProject,
  onRemoveProject,
}) => (
  <ul>
    {projects.map(project => (
      <ProjectItem
        authUser={authUser}
        key={project.uid}
        project={project}
        onEditProject={onEditProject}
        onRemoveProject={onRemoveProject}
      />
    ))}
  </ul>
);

export default ProjectList;
