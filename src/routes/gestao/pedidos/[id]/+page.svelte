<script lang="ts">
  import { page } from '$app/state';
  import { Alert, Badge, Button, Card, Select, Textarea } from '$lib/ui';
  import { LEAD_STATUSES, PREFERENCE_OPTIONS, SERVICE_OPTIONS, CLINICS, type LeadStatus } from '$lib/constants';
  import { leads, notes, currentUser, type Lead, type LeadNote } from '$lib/data';
  import { updateLeadStatus, addLeadNote, ApiError } from '$lib/api';

  const id = page.params.id;
  const found = leads.find((l) => l.id === id);

  let lead = $state<Lead | undefined>(found);
  let leadNotes = $state<LeadNote[]>(notes.filter((n) => n.leadId === id));
  let statusValue = $state(found?.status ?? '');
  let noteBody = $state('');
  let notice = $state('');
  let noteFormError = $state('');
  let submittingNote = $state(false);
  let submittingStatus = $state(false);

  const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }));
  const clinicOptions = CLINICS.map((c) => ({ value: c.id, label: c.label }));
  const label = (list: ReadonlyArray<{ value: string; label: string }>, value?: string) =>
    list.find((o) => o.value === value)?.label ?? '—';
  const stamp = (iso: string) =>
    new Date(iso + 'Z').toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  async function onSaveStatus(e: SubmitEvent) {
    e.preventDefault();
    if (!lead || submittingStatus) return;
    submittingStatus = true;
    notice = '';
    try {
      await updateLeadStatus(lead.id, { status: statusValue });
      lead.status = statusValue as LeadStatus;
      notice = 'Estado do pedido atualizado.';
    } catch (err) {
      notice = err instanceof ApiError ? err.message : 'Ocorreu um erro. Tente novamente.';
    } finally {
      submittingStatus = false;
    }
  }

  async function onAddNote(e: SubmitEvent) {
    e.preventDefault();
    if (!lead || submittingNote) return;
    noteFormError = '';
    if (!noteBody.trim()) {
      noteFormError = 'Escreva o conteúdo da nota.';
      return;
    }
    submittingNote = true;
    try {
      await addLeadNote(lead.id, { body: noteBody.trim() });
      leadNotes = [
        { id: `n-${Date.now()}`, leadId: lead.id, body: noteBody.trim(), authorName: currentUser.name, createdAt: new Date().toISOString() },
        ...leadNotes
      ];
      noteBody = '';
      notice = 'Nota adicionada.';
    } catch (err) {
      noteFormError = err instanceof ApiError ? err.message : 'Ocorreu um erro. Tente novamente.';
    } finally {
      submittingNote = false;
    }
  }
</script>

<svelte:head><title>{lead?.name ?? 'Pedido'} — Pedidos</title></svelte:head>

<a href="/gestao/pedidos" class="link link-hover text-sm text-base-content/60">← Voltar aos pedidos</a>

{#if !lead}
  <main class="mt-10 grid place-items-center px-6 text-center">
    <h1 class="font-display text-2xl font-semibold text-base-content">Pedido não encontrado</h1>
    <p class="text-base-content/60 mt-2">O pedido que procura não existe ou já foi removido.</p>
  </main>
{:else}
  <header class="mt-3 mb-6 flex flex-wrap items-center gap-4">
    <h1 class="font-display text-3xl font-semibold text-base-content">{lead.name}</h1>
    <Badge status={lead.status} />
  </header>

  {#if notice}
    <div class="mb-5"><Alert tone="success">{notice}</Alert></div>
  {/if}

  <div class="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
    <div class="grid gap-6">
      <Card title="Detalhes do pedido">
        <dl class="grid gap-4 sm:grid-cols-2">
          <div><dt class="text-xs uppercase tracking-wider text-base-content/50">Telefone</dt><dd class="mt-1 font-semibold"><a href="tel:{lead.phone}" class="link link-hover">{lead.phone}</a></dd></div>
          <div><dt class="text-xs uppercase tracking-wider text-base-content/50">Email</dt><dd class="mt-1 font-semibold">{#if lead.email}<a href="mailto:{lead.email}" class="link link-hover">{lead.email}</a>{:else}—{/if}</dd></div>
          <div><dt class="text-xs uppercase tracking-wider text-base-content/50">Serviço</dt><dd class="mt-1">{label(SERVICE_OPTIONS, lead.serviceSlug)}</dd></div>
          <div><dt class="text-xs uppercase tracking-wider text-base-content/50">Preferência</dt><dd class="mt-1">{label(PREFERENCE_OPTIONS, lead.preference)}</dd></div>
          <div><dt class="text-xs uppercase tracking-wider text-base-content/50">Clínica</dt><dd class="mt-1">{label(clinicOptions, lead.clinic)}</dd></div>
          <div><dt class="text-xs uppercase tracking-wider text-base-content/50">Recebido</dt><dd class="mt-1 tabular-nums">{stamp(lead.createdAt)}</dd></div>
          <div><dt class="text-xs uppercase tracking-wider text-base-content/50">Consentimento RGPD</dt><dd class="mt-1 tabular-nums">{stamp(lead.consentAt)}</dd></div>
        </dl>

        {#if lead.message}
          <div class="mt-6 rounded-box bg-base-200 p-4">
            <p class="text-xs uppercase tracking-wider text-base-content/50">Mensagem</p>
            <p class="mt-2 text-base-content/80" style="text-wrap: pretty">{lead.message}</p>
          </div>
        {/if}
      </Card>

      <Card title="Notas internas">
        <form onsubmit={onAddNote} class="grid gap-3">
          <Textarea label="Nova nota" name="body" bind:value={noteBody} rows={3} required maxlength={1000} placeholder="Contactado por telefone, aguarda confirmação…" error={noteFormError} />
          <div><Button type="submit" variant="secondary" size="sm" loading={submittingNote}>Adicionar nota</Button></div>
        </form>

        <ul class="mt-6 grid gap-4">
          {#each leadNotes as note (note.id)}
            <li class="border-l-2 border-accent pl-4">
              <p class="text-base-content/80">{note.body}</p>
              <p class="mt-1 text-xs text-base-content/50">{note.authorName} · {stamp(note.createdAt)}</p>
            </li>
          {:else}
            <li class="text-sm text-base-content/50">Ainda sem notas.</li>
          {/each}
        </ul>
      </Card>
    </div>

    <div class="grid gap-6">
      <Card title="Estado">
        <form onsubmit={onSaveStatus} class="grid gap-3">
          <Select label="Estado do pedido" name="status" bind:value={statusValue} options={statusOptions} />
          <div><Button type="submit" size="sm" loading={submittingStatus}>Guardar estado</Button></div>
        </form>
      </Card>

      <Card title="Criar marcação" variant="alt">
        <p class="mb-4 text-sm text-base-content/70">Agenda uma consulta a partir deste pedido e marca-o como <strong>marcado</strong>.</p>
        <Button href="/gestao/marcacoes?lead={lead.id}" variant="secondary" size="sm">Agendar consulta</Button>
      </Card>
    </div>
  </div>
{/if}
