import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useItemsStore, useProjectsStore } from '../store';
import { Header } from '../components/layout';
import { Card, CardContent, Spinner } from '../components/ui';

interface StatCardProps {
  title: string;
  count: number;
  icon: string;
  color: string;
  link: string;
}

function StatCard({ title, count, icon, color, link }: StatCardProps) {
  return (
    <Link to={link}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function DashboardPage() {
  const { items, fetchItems, isLoading: itemsLoading } = useItemsStore();
  const { projects, fetchProjects, isLoading: projectsLoading } = useProjectsStore();
  const [stats, setStats] = useState({
    inbox: 0,
    nextActions: 0,
    waitingFor: 0,
    scheduled: 0,
    someday: 0,
    projects: 0,
  });

  useEffect(() => {
    fetchItems();
    fetchProjects();
  }, [fetchItems, fetchProjects]);

  useEffect(() => {
    const activeItems = items.filter((i) => !i.completed_at);
    setStats({
      inbox: activeItems.filter((i) => i.type === 'inbox').length,
      nextActions: activeItems.filter((i) => i.type === 'next_action').length,
      waitingFor: activeItems.filter((i) => i.type === 'waiting_for').length,
      scheduled: activeItems.filter((i) => i.type === 'scheduled').length,
      someday: activeItems.filter((i) => i.type === 'someday').length,
      projects: projects.filter((p) => p.status === 'active').length,
    });
  }, [items, projects]);

  const isLoading = itemsLoading || projectsLoading;

  return (
    <div>
      <Header title="Dashboard" subtitle="Your GTD overview" />

      {isLoading ? (
        <Spinner className="py-12" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Inbox"
            count={stats.inbox}
            icon="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            color="bg-yellow-500"
            link="/inbox"
          />
          <StatCard
            title="Next Actions"
            count={stats.nextActions}
            icon="M13 10V3L4 14h7v7l9-11h-7z"
            color="bg-blue-500"
            link="/next-actions"
          />
          <StatCard
            title="Waiting For"
            count={stats.waitingFor}
            icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            color="bg-orange-500"
            link="/waiting-for"
          />
          <StatCard
            title="Scheduled"
            count={stats.scheduled}
            icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            color="bg-green-500"
            link="/scheduled"
          />
          <StatCard
            title="Someday/Maybe"
            count={stats.someday}
            icon="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            color="bg-purple-500"
            link="/someday"
          />
          <StatCard
            title="Active Projects"
            count={stats.projects}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            color="bg-indigo-500"
            link="/projects"
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/inbox"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Capture to Inbox
          </Link>
          <Link
            to="/review"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Weekly Review
          </Link>
        </div>
      </div>
    </div>
  );
}
