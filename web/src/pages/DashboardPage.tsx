import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Zap, Clock, CalendarDays, Sparkles, ClipboardList, Plus, CheckCircle } from 'lucide-react';
import { useItemsStore, useProjectsStore } from '../store';
import { Header } from '../components/layout';
import { Card, CardContent, Spinner } from '../components/ui';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  link: string;
}

function StatCard({ title, count, icon, link }: StatCardProps) {
  return (
    <Link to={link}>
      <Card className="hover:border-stone-300 transition-colors">
        <CardContent className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-50 text-amber-600">
            {icon}
          </div>
          <div>
            <p className="text-2xl font-semibold tracking-tight text-stone-900">{count}</p>
            <p className="text-sm text-stone-500">{title}</p>
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
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Inbox"
            count={stats.inbox}
            icon={<Inbox className="w-6 h-6" />}
            link="/inbox"
          />
          <StatCard
            title="Next Actions"
            count={stats.nextActions}
            icon={<Zap className="w-6 h-6" />}
            link="/next-actions"
          />
          <StatCard
            title="Waiting For"
            count={stats.waitingFor}
            icon={<Clock className="w-6 h-6" />}
            link="/waiting-for"
          />
          <StatCard
            title="Scheduled"
            count={stats.scheduled}
            icon={<CalendarDays className="w-6 h-6" />}
            link="/scheduled"
          />
          <StatCard
            title="Someday/Maybe"
            count={stats.someday}
            icon={<Sparkles className="w-6 h-6" />}
            link="/someday"
          />
          <StatCard
            title="Active Projects"
            count={stats.projects}
            icon={<ClipboardList className="w-6 h-6" />}
            link="/projects"
          />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-stone-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/inbox"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Capture to Inbox
          </Link>
          <Link
            to="/review"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 border border-stone-200 rounded-lg hover:bg-stone-200 transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Weekly Review
          </Link>
        </div>
      </div>
    </div>
  );
}
