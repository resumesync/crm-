import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { PipelineChart } from '@/components/dashboard/PipelineChart';
import { RecentLeads } from '@/components/dashboard/RecentLeads';
import { SourceBreakdown } from '@/components/dashboard/SourceBreakdown';
import { dashboardStats } from '@/data/mockData';
import { Users, UserPlus, TrendingUp, Clock, Target, CalendarCheck } from 'lucide-react';

export default function Dashboard() {
  return (
    <Layout>
      <Header title="Dashboard" subtitle="Welcome back, Priya" />
      
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Leads"
            value={dashboardStats.totalLeads}
            change="+12% from last month"
            changeType="positive"
            icon={Users}
            iconColor="bg-primary/10 text-primary"
            delay={0}
          />
          <StatCard
            title="New Today"
            value={dashboardStats.newLeads}
            change={`${dashboardStats.todayLeads} added today`}
            changeType="neutral"
            icon={UserPlus}
            iconColor="bg-status-new/10 text-status-new"
            delay={50}
          />
          <StatCard
            title="Converted"
            value={dashboardStats.converted}
            change={`${dashboardStats.conversionRate}% conversion rate`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-status-converted/10 text-status-converted"
            delay={100}
          />
          <StatCard
            title="Follow-ups Due"
            value={dashboardStats.followupRequired}
            change="Needs attention"
            changeType="negative"
            icon={Clock}
            iconColor="bg-status-followup/10 text-status-followup"
            delay={150}
          />
        </div>

        {/* Charts Row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <PipelineChart />
          <SourceBreakdown />
        </div>

        {/* Recent Leads */}
        <div className="mt-6">
          <RecentLeads />
        </div>
      </div>
    </Layout>
  );
}
