<script>
  import { TextInput, Select, Textarea, Checkbox, Button, Alert } from '$lib/ui';
  import { SERVICE_OPTIONS, PREFERENCE_OPTIONS, CLINICS } from '$lib/constants';
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

  const clinicOptions = [
    { value: '', label: 'Sem preferência' },
    ...CLINICS.map((c) => ({ value: c.id, label: c.label }))
  ];

  /** @type {Record<string, string>} */
  let errors = $state({});
  /** @type {{ ok?: boolean, firstName?: string } | null} */
  let done = $state(null);
  let formError = $state('');
  let submitting = $state(false);

  /** @returns {Record<string, string>} */
  function validate() {
    /** @type {Record<string, string>} */
    const e = {};
    if (!name.trim()) e.name = 'Indique o seu nome.';
    if (!/^[0-9\s+]{9,15}$/.test(phone.trim())) e.phone = 'Indique um telefone válido.';
    if (email && !/^\S+@\S+\.\S+$/.test(email.trim())) e.email = 'Indique um email válido.';
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
      const result = await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        service: service || 'checkup',
        preference: preference || 'indiferente',
        clinic: clinic || undefined,
        message: message.trim() || undefined,
        consent
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
    class="card rounded-box flex flex-col gap-4 border border-base-300 bg-base-100 p-6 shadow-card md:p-8"
  >
    {#if formError}
      <Alert tone="error">{formError}</Alert>
    {/if}

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
      error={errors.email} />

    <div class="grid gap-4 sm:grid-cols-2">
      <Select label="Motivo da consulta" name="service" bind:value={service} options={SERVICE_OPTIONS} error={errors.service} />
      <Select
        label="Melhor horário para contacto"
        name="preference"
        bind:value={preference}
        options={PREFERENCE_OPTIONS} />
      <Select
        label="Clínica de preferência"
        name="clinic"
        bind:value={clinic}
        options={clinicOptions} />
    </div>

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
  </form>
{/if}
