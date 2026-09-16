<script>
  /**
   * Alert — form-level and page-level messages. daisyUI `alert`, softened.
   * @type {{ tone?: 'success'|'error'|'info'|'warning', title?: string,
   *          class?: string, children?: import('svelte').Snippet }}
   */
  let { tone = 'info', title, class: klass = '', children } = $props();

  const tones = {
    success: 'bg-success/10 text-success',
    error: 'bg-error/10 text-error',
    info: 'bg-teal-50 text-teal-600',
    warning: 'bg-gold-50 text-gold-600'
  };
</script>

<div class="alert rounded-field border-0 {tones[tone]} {klass}" role={tone === 'error' ? 'alert' : 'status'}>
  <div class="text-sm">
    {#if title}<p class="font-semibold">{title}</p>{/if}
    {@render children?.()}
  </div>
</div>
