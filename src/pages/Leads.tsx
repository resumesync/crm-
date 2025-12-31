import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Header } from '@/components/layout/Header';
import { LeadTable } from '@/components/leads/LeadTable';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';

export default function Leads() {
  const [addLeadOpen, setAddLeadOpen] = useState(false);

  return (
    <Layout>
      <Header
        title="Leads"
        subtitle="Manage and track all your leads"
        onAddLead={() => setAddLeadOpen(true)}
      />
      
      <div className="p-6">
        <LeadTable />
      </div>

      <AddLeadDialog open={addLeadOpen} onOpenChange={setAddLeadOpen} />
    </Layout>
  );
}
