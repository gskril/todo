create table "public"."todos" (
    "id" uuid not null,
    "user_id" uuid not null,
    "title" text not null,
    "tag" text not null,
    "completed" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."todos" enable row level security;

CREATE UNIQUE INDEX todos_pkey ON public.todos USING btree (id);

alter table "public"."todos" add constraint "todos_pkey" PRIMARY KEY using index "todos_pkey";

alter table "public"."todos" add constraint "todos_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."todos" validate constraint "todos_user_id_fkey";

create policy "Enable all for authenticated users only"
on "public"."todos"
as permissive
for all
to authenticated
using ((auth.uid() = user_id))
with check (true);



