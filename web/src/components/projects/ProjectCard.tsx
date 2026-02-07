import { Project } from '../../types';
import { Card, CardContent, Button } from '../ui';

interface ProjectCardProps {
  project: Project;
  itemCount?: number;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  someday: 'bg-purple-100 text-purple-800',
};

const horizonLabels = {
  project: 'Project',
  area: 'Area of Focus',
  goal: 'Goal',
  vision: 'Vision',
  purpose: 'Purpose',
};

export function ProjectCard({ project, itemCount, onClick, onDelete }: ProjectCardProps) {
  return (
    <Card onClick={onClick}>
      <CardContent className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            <span>{horizonLabels[project.horizon]}</span>
            {typeof itemCount === 'number' && (
              <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project.id);
            }}
          >
            <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
