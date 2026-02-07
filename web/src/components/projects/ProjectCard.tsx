import { Trash2 } from 'lucide-react';
import { Project } from '../../types';
import { Card, CardContent, Button } from '../ui';

interface ProjectCardProps {
  project: Project;
  itemCount?: number;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

const statusColors = {
  active: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-stone-100 text-stone-700',
  someday: 'bg-amber-50 text-amber-700',
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
            <h3 className="font-medium text-stone-900 truncate">{project.name}</h3>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
          {project.description && (
            <p className="text-sm text-stone-500 mt-1 line-clamp-2">{project.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
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
            <Trash2 className="w-4 h-4 text-stone-400 hover:text-rose-500" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
