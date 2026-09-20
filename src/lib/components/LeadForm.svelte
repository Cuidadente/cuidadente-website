<script>
  import { TextInput, Select, Textarea, Checkbox, Button, Alert } from '$lib/ui';
  import { SERVICE_OPTIONS, PREFERENCE_OPTIONS, CLINICS, DAY_OPTIONS } from '$lib/constants';
  import { submitLead, ApiError } from '$lib/api';

  /**
   * LeadForm — the appointment-request form.
   * Renders entirely from local state and, on submit, POSTs the lead to the
   * API (`POST /leads`). No request is made to render the form or the page.
   */

  let name = $state('');
  let phone = $state('');
  let email = $state('');
  let service = $state('');
  let preference = $state('');
  let clinic = $state('');
  let message = $state('');
  let consent = $state(false);
  /** @type {string[]} Selected weekday slugs, e.g. ['seg', 'qua']. */
  let preferredDays = $state([]);

  const clinicOptions = [
    { value: '', label: 'Sem preferência' },
    ...CLINICS.map((c) => ({ value: c.id, label: c.label }))
  ];

  // Map local (pt) day/slot slugs to the intake API's English spellings.
  /** @type {Record<string, string>} */
  const DAY_TO_EN = {
    seg: 'mon', ter: 'tue', qua: 'wed', qui: 'thu', sex: 'fri', sab: 'sat', dom: 'sun'
  };
  /** @type {Record<string, string>} */
  const SLOT_TO_EN = {
    manha: 'morning',
    tarde: 'afternoon'
  };

  /** @type {Record<string, string>} */
  let errors = $state({});
  /** @type {{ ok?: boolean, firstName?: string } | null} */
  let done = $state(null);
  let formError = $state('');
  let submitting = $state(false);

  /** @param {string} value */
  function toggleDay(value) {
    preferredDays = preferredDays.includes(value)
      ? preferredDays.filter((d) => d !== value)
      : [...preferredDays, value];
  }

  /** @returns {Record<string, string>} */
  function validate() {
    /** @type {Record<string, string>} */
    const e = {};
    if (!name.trim()) e.name = 'Indique o seu nome.';
    if (!/^[0-9\s+]{9,15}$/.test(phone.trim())) e.phone = 'Indique um telefone válido.';
    if (!email.trim()) e.email = 'Indique o seu email.';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Indique um email válido.';
    if (!consent) e.consent = 'Precisa de autorizar o contacto para enviar o pedido.';
    return e;
  }

  /** @param {SubmitEvent} e */
  async function onSubmit(e) {
    e.preventDefault();
    const localErrors = validate();
    errors = localErrors;
    formError = '';
    if (Object.keys(localErrors).length > 0) return;

    submitting = true;
    try {
      // Build the intake payload the API expects.
      const selectedService = SERVICE_OPTIONS.find((o) => o.value === service);
      const motive = selectedService?.label ?? SERVICE_OPTIONS[0]?.label ?? '';
      const clinicName = CLINICS.find((c) => c.id === clinic)?.label;
      // Clinic preference is prefixed to the free-text description.
      const descParts = [];
      if (clinicName) descParts.push(`Preferência: ${clinicName}`);
      const msg = message.trim();
      if (msg) descParts.push(msg);
      const availabilitySlot = SLOT_TO_EN[preference];
      const availabilityDays = preferredDays
        .map((d) => DAY_TO_EN[d])
        .filter(Boolean);

      const result = await submitLead({
        full_name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        motive,
        description: descParts.length ? descParts.join('\n') : null,
        availability_days: availabilityDays.length ? availabilityDays : undefined,
        availability_slot: availabilitySlot || undefined
      });
      done = { ok: true, firstName: result.firstName };
    } catch (err) {
      if (err instanceof ApiError) {
        errors = err.fieldErrors;
        formError = err.fieldErrors._form ?? err.message;
      } else {
        formError = 'Ocorreu um erro. Tente novamente.';
      }
    } finally {
      submitting = false;
    }
  }

  /** @param {boolean} on */
  function chip(on) {
    return `rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
      on
        ? 'border-primary bg-primary text-primary-content shadow-card'
        : 'border-base-300 bg-base-100 text-base-content/70 hover:border-teal-300 hover:text-base-content'
    }`;
  }
</script>

{#if done?.ok}
  <div class="card rounded-box border border-base-300 bg-base-100 p-8 shadow-card">
    <h3 class="font-display text-2xl font-semibold">Pedido enviado</h3>
    <p class="mt-3 text-base-content/60">
      Obrigado{done.firstName ? `, ${done.firstName}` : ''}. A nossa equipa entra em contacto
      consigo durante o próximo dia útil para combinar a sua consulta.
    </p>
  </div>
{:else}
  <form
    onsubmit={onSubmit}
    class="card rounded-box border border-base-300 bg-base-100 p-6 shadow-card md:p-8"
  >
    {#if formError}
      <Alert tone="error">{formError}</Alert>
    {/if}

    <div class="flex flex-col gap-6">
      <!-- 1 · Dados de contacto -->
      <section class="flex flex-col gap-4">
        <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-teal-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Os seus dados
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Nome completo"
            name="name"
            bind:value={name}
            placeholder="O seu nome"
            autocomplete="name"
            required
            error={errors.name} />
          <TextInput
            label="Telefone"
            name="phone"
            type="tel"
            bind:value={phone}
            placeholder="9xx xxx xxx"
            autocomplete="tel"
            required
            error={errors.phone} />
        </div>
        <TextInput
          label="Email"
          name="email"
          type="email"
          bind:value={email}
          placeholder="nome@exemplo.pt"
          autocomplete="email"
          required
          error={errors.email} />
      </section>

      <span class="h-px bg-base-200" aria-hidden="true"></span>

      <!-- 2 · A consulta -->
      <section class="flex flex-col gap-4">
        <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-teal-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Z" />
          </svg>
          A sua consulta
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <Select label="Motivo da consulta" name="service" bind:value={service} options={SERVICE_OPTIONS} error={errors.service} />
          <Select
            label="Clínica de preferência"
            name="clinic"
            bind:value={clinic}
            options={clinicOptions} />
        </div>
      </section>

      <span class="h-px bg-base-200" aria-hidden="true"></span>

      <!-- 3 · Disponibilidade -->
      <section class="flex flex-col gap-4">
        <h3 class="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-teal-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          Disponibilidade
        </h3>
        <div class="grid gap-4 sm:grid-cols-2">
          <Select
            label="Preferência de horário"
            name="preference"
            bind:value={preference}
            options={PREFERENCE_OPTIONS} />
          <div>
            <p class="pb-1 text-[0.8125rem] font-semibold">
              Dias de preferência para a consulta
              <span class="ml-0.5 font-normal text-base-content/45">(pode escolher vários)</span>
            </p>
            <div class="flex flex-wrap gap-2" role="group" aria-label="Dias de preferência">
              {#each DAY_OPTIONS as d (d.value)}
                <button
                  type="button"
                  aria-pressed={preferredDays.includes(d.value)}
                  onclick={() => toggleDay(d.value)}
                  class="min-w-12 justify-center {chip(preferredDays.includes(d.value))}">
                  {d.label}
                </button>
              {/each}
            </div>
          </div>
        </div>
      </section>

      <span class="h-px bg-base-200" aria-hidden="true"></span>

      <!-- 4 · Mensagem + autorização -->
      <section class="flex flex-col gap-4">
        <Textarea
          label="Mensagem (opcional)"
          name="message"
          bind:value={message}
          placeholder="Alguma nota para a nossa equipa"
          maxlength={1000} />
        <Checkbox name="consent" bind:checked={consent} error={errors.consent}>
          Concordo em ser contactado pela CuidaDente sobre a minha marcação.
        </Checkbox>
        <Button type="submit" size="lg" block loading={submitting}>Pedir contacto</Button>
        <p class="text-xs text-base-content/50">
          Os seus dados são usados apenas para responder a este pedido.
          <a href="/privacidade" class="text-teal-600 underline-offset-2 hover:underline">Política de privacidade</a>.
        </p>
      </section>
    </div>
  </form>
{/if}
