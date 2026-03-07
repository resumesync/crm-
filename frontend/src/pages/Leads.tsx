import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { LeadTable } from '@/components/leads/LeadTable';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';
import { GoogleSheetsSyncDialog } from '@/components/leads/GoogleSheetsSyncDialog';

export default function Leads() {
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Layout>
      <Header
        title="Leads"
        subtitle="Manage and track all your leads"
        onAddLead={() => setAddLeadOpen(true)}
        onSyncSheets={() => setSyncOpen(true)}
      />

      <div className="p-6">
        <LeadTable key={refreshKey} />
      </div>

      <AddLeadDialog open={addLeadOpen} onOpenChange={setAddLeadOpen} onSuccess={() => setRefreshKey(prev => prev + 1)} />
      <GoogleSheetsSyncDialog open={syncOpen} onOpenChange={setSyncOpen} onSuccess={() => setRefreshKey(prev => prev + 1)} />
    </Layout>
  );
}
