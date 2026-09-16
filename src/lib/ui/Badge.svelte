<script>
  /**
   * Badge — status pills for the leads inbox and role labels.
   * @type {{ status?: 'novo'|'contactado'|'marcado'|'fechado',
   *          tone?: 'neutral'|'info'|'success'|'warning'|'error'|'accent',
   *          class?: string, children?: import('svelte').Snippet }}
   */
  let { status, tone = 'neutral', class: klass = '', children } = $props();

  /** Lead status → tone + pt-PT label. Single source of truth. */
  /** @type {Record<'novo'|'contactado'|'marcado'|'fechado', { tone: 'neutral'|'info'|'success'|'warning'|'error'|'accent', label: string }>} */
  const statusMap = {
    novo:       { tone: 'info',    label: 'Novo' },
    contactado: { tone: 'warning', label: 'Contactado' },
    marcado:    { tone: 'success', label: 'Marcado' },
    fechado:    { tone: 'neutral', label: 'Fechado' }
  };

  /** @type {Record<'neutral'|'info'|'success'|'warning'|'error'|'accent', string>} */
  const tones = {
    neutral: 'bg-base-300 text-base-content/60',
    info: 'bg-teal-50 text-teal-600',
    success: 'bg-success/12 text-success',
    warning: 'bg-gold-50 text-gold-600',
    error: 'bg-error/12 text-error',
    accent: 'bg-teal-50 text-teal-600'
  };

  let resolved = $derived(status ? statusMap[status] : null);
  let toneClass = $derived(tones[resolved?.tone ?? tone]);
</script>

<span class="badge badge-sm rounded-selector border-0 px-3 py-2.5 text-xs font-medium {toneClass} {klass}">
  {#if children}{@render children()}{:else}{resolved?.label ?? ''}{/if}
</span>
