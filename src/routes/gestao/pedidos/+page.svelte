<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Badge, Card, DataTable } from '$lib/ui';
  import { LEAD_STATUSES, SERVICE_OPTIONS } from '$lib/constants';
  import { leads } from '$lib/data';

  let q = $state(page.url.searchParams.get('q') ?? '');
  let activeStatus = $derived(page.url.searchParams.get('status') ?? '');
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let timer = undefined;

  /** Filters live in the URL, never in component state. */
  /**
   * @param {string} key
   * @param {string} value
   */
  function setParam(key, value) {
    const url = new URL(page.url);
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
    goto(url, { keepFocus: true, replaceState: true, noScroll: true });
  }

  /** @param {Event} event */
  function onSearch(event) {
    q = /** @type {HTMLInputElement} */ (event.currentTarget).value;
    clearTimeout(timer);
    timer = setTimeout(() => setParam('q', q), 300);
  }

  const filteredLeads = $derived(
    leads
      .filter((l) => !activeStatus || l.status === activeStatus)
      .filter((l) => {
        const needle = q.trim().toLowerCase();
        if (!needle) return true;
        return (
          l.name.toLowerCase().includes(needle) ||
          l.phone.replace(/\s/g, '').includes(needle.replace(/\s/g, '')) ||
          (l.email ?? '').toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );

  /** @type {(slug: string) => string} */
  const serviceLabel = (slug) => SERVICE_OPTIONS.find((s) => s.value === slug)?.label ?? '—';
  /** @type {(iso: string) => string} */
  const date = (iso) => new Date(iso + 'Z').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: '2-digit' });
</script>

<svelte:head><title>Pedidos — Gestão CuidaDente</title></svelte:head>

<header class="mb-6">
  <p class="eyebrow">Gestão</p>
  <h1 class="font-display text-3xl font-semibold text-base-content">Pedidos de consulta</h1>
</header>

<Card>
  <div class="mb-5 flex flex-wrap items-center gap-3">
    <div class="flex flex-wrap gap-1" role="group" aria-label="Filtrar por estado">
      <button
        type="button"
        onclick={() => setParam('status', '')}
        aria-pressed={!activeStatus}
        class="min-h-11 rounded-field px-3 text-sm font-semibold {!activeStatus ? 'bg-neutral text-neutral-content' : 'text-base-content/60 hover:bg-base-200'}"
      >
        Todos
      </button>
      {#each LEAD_STATUSES as status (status)}
        <button
          type="button"
          onclick={() => setParam('status', status)}
          aria-pressed={activeStatus === status}
          class="min-h-11 rounded-field px-3 text-sm font-semibold capitalize {activeStatus === status ? 'bg-neutral text-neutral-content' : 'text-base-content/60 hover:bg-base-200'}"
        >
          {status}
        </button>
      {/each}
    </div>

    <label class="ml-auto w-full sm:w-64">
      <span class="sr-only">Procurar por nome, telefone ou email</span>
      <input
        class="input input-bordered w-full"
        type="search"
        value={q}
        oninput={onSearch}
        placeholder="Procurar nome ou telefone…"
      />
    </label>
  </div>

  <DataTable
    columns={['Nome', 'Contacto', 'Serviço', 'Recebido', 'Estado', '']}
    isEmpty={filteredLeads.length === 0}
    empty="Nenhum pedido corresponde a estes filtros."
  >
    {#snippet rows()}
      {#each filteredLeads as lead (lead.id)}
        <tr>
          <td class="font-semibold">{lead.name}</td>
          <td class="text-sm">{lead.phone}{#if lead.email}<span class="block text-base-content/50">{lead.email}</span>{/if}</td>
          <td class="text-sm">{serviceLabel(lead.serviceSlug)}</td>
          <td class="text-sm tabular-nums text-base-content/60">{date(lead.createdAt)}</td>
          <td><Badge status={lead.status} /></td>
          <td class="text-right"><a href="/gestao/pedidos/{lead.id}" class="link link-hover text-sm text-teal-600">Abrir</a></td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>

  {#if filteredLeads.length === 0}
    <p class="mt-4 text-sm text-base-content/50">Nenhum pedido corresponde a estes filtros.</p>
  {/if}
</Card>
