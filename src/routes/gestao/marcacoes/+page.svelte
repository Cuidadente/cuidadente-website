<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Alert, Badge, Button, Card, DataTable, Modal, Select, TextInput, Textarea } from '$lib/ui';
  import { leads, doctors, appointmentsForDate, type Appointment } from '$lib/data';
  import { createAppointment, cancelAppointment, ApiError } from '$lib/api';

  const urlDate = page.url.searchParams.get('data') ?? '';
  const date = /^\d{4}-\d{2}-\d{2}$/.test(urlDate) ? urlDate : new Date().toISOString().slice(0, 10);

  const leadId = page.url.searchParams.get('lead');
  const prefillLead = leadId ? leads.find((l) => l.id === leadId) : undefined;
  const leadPrefill = prefillLead ? { id: prefillLead.id, name: prefillLead.name } : null;

  let appointments = $state<Appointment[]>(appointmentsForDate(date).map((a) => ({ ...a })));
  let creating = $state(Boolean(leadPrefill));
  let notice = $state('');

  // New-appointment form state.
  let patientName = $state(leadPrefill?.name ?? '');
  let fDate = $state(date);
  let fTime = $state('09:00');
  let durationMin = $state('30');
  let doctorId = $state('');
  let notes = $state('');
  let formErrors = $state<Record<string, string>>({});
  let formMessage = $state('');
  let submitting = $state(false);

  const statusTone: Record<'agendada' | 'concluida' | 'cancelada' | 'falta', 'success' | 'accent' | 'error' | 'warning'> = {
    agendada: 'success',
    concluida: 'accent',
    cancelada: 'error',
    falta: 'warning'
  };
  const time = (iso: string) => new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  function shiftDay(offset: number) {
    const d = new Date(date + 'T12:00:00');
    d.setDate(d.getDate() + offset);
    const url = new URL(page.url);
    url.searchParams.set('data', d.toISOString().slice(0, 10));
    goto(url, { replaceState: true, noScroll: true });
  }

  async function onCreate(e: SubmitEvent) {
    e.preventDefault();
    formMessage = '';
    const errors: Record<string, string> = {};
    if (!patientName.trim()) errors.patientName = 'Indique o nome do paciente.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fDate)) errors.fDate = 'Indique uma data válida.';
    if (!/^\d{2}:\d{2}$/.test(fTime)) errors.fTime = 'Indique uma hora válida.';
    if (Object.keys(errors).length > 0) {
      formErrors = errors;
      return;
    }

    submitting = true;
    try {
      await createAppointment({
        leadId: leadPrefill?.id,
        patientName: patientName.trim(),
        date: fDate,
        time: fTime,
        durationMin: Number(durationMin) || 30,
        doctorId: doctorId || undefined,
        notes: notes.trim() || undefined
      });
      appointments = appointmentsForDate(date).map((a) => ({ ...a }));
      notice = 'Marcação criada.';
      creating = false;
      patientName = '';
      fTime = '09:00';
      notes = '';
    } catch (err) {
      if (err instanceof ApiError) formMessage = err.message;
      else formMessage = 'Ocorreu um erro. Tente novamente.';
    } finally {
      submitting = false;
    }
  }

  async function onCancel(id: string) {
    if (submitting) return;
    submitting = true;
    try {
      await cancelAppointment(id);
      appointments = appointments.map((a) => (a.id === id ? { ...a, status: 'cancelada' } : a));
      notice = 'Marcação cancelada.';
    } catch (err) {
      notice = err instanceof ApiError ? err.message : 'Ocorreu um erro. Tente novamente.';
    } finally {
      submitting = false;
    }
  }

  const durationOptions = [
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '60', label: '60 minutos' }
  ];
</script>

<svelte:head><title>Marcações — Gestão CuidaDente</title></svelte:head>

<header class="mb-6 flex flex-wrap items-end justify-between gap-4">
  <div>
    <p class="eyebrow">Gestão</p>
    <h1 class="font-display text-3xl font-semibold text-base-content">Marcações</h1>
  </div>
  <Button onclick={() => (creating = true)}>Nova marcação</Button>
</header>

{#if notice}
  <div class="mb-5"><Alert tone="success">{notice}</Alert></div>
{/if}

<Card>
  <div class="mb-5 flex items-center justify-between gap-3">
    <Button variant="ghost" size="sm" onclick={() => shiftDay(-1)}>← Dia anterior</Button>
    <p class="font-display text-lg font-semibold">
      {new Date(date + 'T12:00:00').toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: 'long' })}
    </p>
    <Button variant="ghost" size="sm" onclick={() => shiftDay(1)}>Dia seguinte →</Button>
  </div>

  <DataTable
    columns={['Hora', 'Paciente', 'Médico(a)', 'Estado', '']}
    isEmpty={appointments.length === 0}
    empty="Sem marcações neste dia."
  >
    {#snippet rows()}
      {#each appointments as appt (appt.id)}
        <tr>
          <td class="font-semibold tabular-nums">{time(appt.startsAt)}<span class="block text-xs font-normal text-base-content/50">{appt.durationMin} min</span></td>
          <td>{appt.patientName}</td>
          <td class="text-sm">{appt.doctorName ?? '—'}</td>
          <td><Badge tone={statusTone[appt.status]}>{appt.status}</Badge></td>
          <td class="text-right">
            {#if appt.status === 'agendada'}
              <button type="button" onclick={() => onCancel(appt.id)} class="link link-hover text-sm text-error">
                Cancelar
              </button>
            {/if}
          </td>
        </tr>
      {/each}
    {/snippet}
  </DataTable>
</Card>

<Modal bind:open={creating} title="Nova marcação">
  <form onsubmit={onCreate} id="nova-marcacao" class="grid gap-4">
    {#if formMessage}
      <Alert tone="error">{formMessage}</Alert>
    {/if}
    <TextInput label="Nome do paciente" name="patientName" required bind:value={patientName} error={formErrors.patientName} />
    <div class="grid gap-4 sm:grid-cols-2">
      <TextInput label="Data" name="date" type="date" required bind:value={fDate} error={formErrors.fDate} />
      <TextInput label="Hora" name="time" type="time" required bind:value={fTime} error={formErrors.fTime} />
    </div>
    <div class="grid gap-4 sm:grid-cols-2">
      <Select label="Duração" name="durationMin" bind:value={durationMin} options={durationOptions} />
      <Select label="Médico(a)" name="doctorId" placeholder="Sem atribuição" bind:value={doctorId} options={doctors.map((d) => ({ value: d.id, label: d.name }))} />
    </div>
    <Textarea label="Notas" name="notes" bind:value={notes} rows={2} maxlength={500} />
  </form>

  {#snippet actions()}
    <Button variant="ghost" onclick={() => (creating = false)}>Cancelar</Button>
    <Button type="submit" form="nova-marcacao" loading={submitting}>Criar marcação</Button>
  {/snippet}
</Modal>
