<script>
  import { Badge, Button, Card, DataTable, Stat } from '$lib/ui';
  import { SERVICE_OPTIONS } from '$lib/constants';
  import { currentUser, leads, appointmentsForDate, leadStats } from '$lib/data';

  const user = currentUser;
  const stats = leadStats();

  const recentLeads = [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((l) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      serviceSlug: l.serviceSlug,
      status: l.status,
      createdAt: l.createdAt
    }));

  const today = appointmentsForDate(new Date().toISOString().slice(0, 10)).map((a) => ({
    id: a.id,
    startsAt: a.startsAt,
    patientName: a.patientName,
    status: a.status
  }));

  /** @type {(slug: string) => string} */
  const serviceLabel = (slug) => SERVICE_OPTIONS.find((s) => s.value === slug)?.label ?? '—';
  /** @type {(iso: string) => string} */
  const time = (iso) =>
    new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
  /** @type {(iso: string) => string} */
  const day = (iso) => new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
</script>

<svelte:head><title>Painel — Gestão CuidaDente</title></svelte:head>

<header class="mb-8 flex flex-wrap items-end justify-between gap-4">
  <div>
    <p class="eyebrow">Gestão</p>
    <h1 class="font-display text-3xl font-semibold text-base-content">Olá, {user.name.split(' ')[0]}</h1>
  </div>
  <Button href="/gestao/pedidos?status=novo" variant="secondary">Ver pedidos novos</Button>
</header>

<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <Stat value={stats.novos} label="Pedidos novos" tone="accent" />
  <Stat value={stats.semana} label="Pedidos (7 dias)" />
  <Stat value={stats.hoje} label="Marcações hoje" />
  <Stat value={stats.conversao + '%'} label="Taxa de conversão" />
</div>

<div class="mt-8 grid gap-6 lg:grid-cols-2">
  <Card title="Últimos pedidos">
    <DataTable columns={['Nome', 'Serviço', 'Estado', '']} isEmpty={recentLeads.length === 0} empty="Sem pedidos.">
      {#snippet rows()}
        {#each recentLeads as lead (lead.id)}
          <tr>
            <td class="font-semibold">{lead.name}<span class="block text-xs font-normal text-base-content/50">{lead.phone}</span></td>
            <td>{serviceLabel(lead.serviceSlug)}</td>
            <td><Badge status={lead.status} /></td>
            <td class="text-right"><a href="/gestao/pedidos/{lead.id}" class="link link-hover text-teal-600 text-sm">Abrir</a></td>
          </tr>
        {/each}
      {/snippet}
    </DataTable>
  </Card>

  <Card title="Agenda de hoje">
    <DataTable columns={['Hora', 'Paciente', 'Estado']} isEmpty={today.length === 0} empty="Sem marcações para hoje.">
      {#snippet rows()}
        {#each today as appt (appt.id)}
          <tr>
            <td class="font-semibold tabular-nums">{time(appt.startsAt)}<span class="block text-xs font-normal text-base-content/50">{day(appt.startsAt)}</span></td>
            <td>{appt.patientName}</td>
            <td><Badge tone={appt.status === 'cancelada' ? 'error' : 'success'}>{appt.status}</Badge></td>
          </tr>
        {/each}
      {/snippet}
    </DataTable>
  </Card>
</div>
