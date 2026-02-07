import { Project } from '../../types';
import { ProjectCard } from './ProjectCard';
import { Spinner } from '../ui';

interface ProjectListProps {
  projects: Project[];
  isLoading?: boolean;
  emptyMessage?: string;
  onProjectClick?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export function ProjectList({
  projects,
  isLoading,
  emptyMessage = 'No projects',
  onProjectClick,
  onDelete,
}: ProjectListProps) {
  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick?.(project)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
