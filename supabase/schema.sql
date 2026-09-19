create table if not exists public.trips (
  id uuid primary key,
  owner_id text not null,
  condition jsonb not null default '{}'::jsonb,
  itinerary jsonb not null default '[]'::jsonb,
  summary text not null default '',
  rating integer check (rating between 1 and 5),
  review text not null default '',
  visited_places jsonb not null default '[]'::jsonb,
  status text not null default 'planned' check (status in ('planned', 'active', 'finished')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trips_owner_created_idx on public.trips (owner_id, created_at desc);

create table if not exists public.trip_events (
  id bigint generated always as identity primary key,
  trip_id uuid references public.trips(id) on delete cascade,
  owner_id text not null,
  event text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists trip_events_owner_created_idx on public.trip_events (owner_id, created_at desc);

alter table public.trips enable row level security;
alter table public.trip_events enable row level security;
