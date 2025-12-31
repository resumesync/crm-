-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Organizations table
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro', 'enterprise')),
  subscription_status text not null default 'trial' check (subscription_status in ('trial', 'active', 'cancelled', 'past_due')),
  trial_ends_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  settings jsonb default '{}'::jsonb
);

-- Organization members table
create table organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null default 'agent' check (role in ('owner', 'admin', 'manager', 'agent')),
  invited_by uuid references auth.users(id),
  joined_at timestamp with time zone default now(),
  unique(organization_id, user_id)
);

-- Leads table (multi-tenant)
create table leads (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  phone text not null,
  email text,
  alternate_phone text,
  whatsapp_number text,
  service text not null,
  clinic_name text not null,
  city text not null,
  state text,
  pincode text,
  address text,
  source text not null,
  status text not null,
  assigned_to uuid references auth.users(id),
  created_by uuid references auth.users(id) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  birthday date,
  age integer,
  gender text check (gender in ('male', 'female', 'other')),
  occupation text,
  company_name text,
  referred_by text,
  language_preference text,
  best_time_to_call text,
  previous_clinic_visited boolean default false,
  budget text,
  urgency text check (urgency in ('immediate', 'this_week', 'this_month', 'exploring')),
  meta_data jsonb,
  google_data jsonb
);

-- Notes table (for lead notes)
create table notes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade not null,
  content text not null,
  created_by uuid references auth.users(id) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);


-- Row Level Security (RLS) Policies

-- Enable RLS
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table leads enable row level security;
alter table notes enable row level security;


-- Organizations policies
create policy "Users can view their organizations"
  on organizations for select
  using (
    id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "Owners and admins can update their organizations"
  on organizations for update
  using (
    id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Organization members policies
create policy "Users can view members of their organizations"
  on organization_members for select
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "Owners and admins can manage members"
  on organization_members for all
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Leads policies
create policy "Users can view leads in their organizations"
  on leads for select
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "Users can create leads in their organizations"
  on leads for insert
  with check (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "Users can update leads in their organizations"
  on leads for update
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "Owners and admins can delete leads"
  on leads for delete
  using (
    organization_id in (
      select organization_id from organization_members
      where user_id = auth.uid()
      and role in ('owner', 'admin')
    )
  );

-- Indexes for performance
create index idx_leads_organization_id on leads(organization_id);
create index idx_leads_assigned_to on leads(assigned_to);
create index idx_leads_created_at on leads(created_at desc);
create index idx_organization_members_user_id on organization_members(user_id);
create index idx_organization_members_org_id on organization_members(organization_id);
create index idx_notes_lead_id on notes(lead_id);
create index idx_notes_created_at on notes(created_at desc);

-- Notes policies
create policy "Users can view notes for leads in their organizations"
  on notes for select
  using (
    lead_id in (
      select id from leads
      where organization_id in (
        select organization_id from organization_members
        where user_id = auth.uid()
      )
    )
  );

create policy "Users can create notes for leads in their organizations"
  on notes for insert
  with check (
    lead_id in (
      select id from leads
      where organization_id in (
        select organization_id from organization_members
        where user_id = auth.uid()
      )
    )
  );

create policy "Users can update their own notes"
  on notes for update
  using (created_by = auth.uid());

create policy "Users can delete their own notes"
  on notes for delete
  using (created_by = auth.uid());

-- Trigger to update updated_at

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_leads_updated_at
  before update on leads
  for each row
  execute function update_updated_at_column();

create trigger update_notes_updated_at
  before update on notes
  for each row
  execute function update_updated_at_column();

