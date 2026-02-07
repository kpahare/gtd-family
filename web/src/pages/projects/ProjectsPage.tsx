import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectsStore } from '../../store';
import { Header } from '../../components/layout';
import { ProjectList, ProjectForm } from '../../components/projects';
import { Button } from '../../components/ui';

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, isLoading, fetchProjects, addProject, deleteProject } = useProjectsStore();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const activeProjects = projects.filter((p) => p.status === 'active');
  const completedProjects = projects.filter((p) => p.status === 'completed');
  const somedayProjects = projects.filter((p) => p.status === 'someday');

  return (
    <div>
      <Header
        title="Projects"
        subtitle={`${activeProjects.length} active project${activeProjects.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </Button>
        }
      />

      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Active</h2>
          <ProjectList
            projects={activeProjects}
            isLoading={isLoading}
            emptyMessage="No active projects"
            onProjectClick={(p) => navigate(`/projects/${p.id}`)}
            onDelete={deleteProject}
          />
        </section>

        {somedayProjects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Someday/Maybe</h2>
            <ProjectList
              projects={somedayProjects}
              onProjectClick={(p) => navigate(`/projects/${p.id}`)}
              onDelete={deleteProject}
            />
          </section>
        )}

        {completedProjects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed</h2>
            <ProjectList
              projects={completedProjects}
              onProjectClick={(p) => navigate(`/projects/${p.id}`)}
              onDelete={deleteProject}
            />
          </section>
        )}
      </div>

      <ProjectForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={addProject}
      />
    </div>
  );
}
