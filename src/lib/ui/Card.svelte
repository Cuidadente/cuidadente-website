<script>
  /**
   * Card — daisyUI `card`. Optional title; body is the default snippet.
   * @type {{ title?: string, variant?: 'default'|'alt'|'flat', padding?: 'md'|'lg',
   *          class?: string, children?: import('svelte').Snippet,
   *          actions?: import('svelte').Snippet }}
   */
  let { title, variant = 'default', padding = 'md', class: klass = '', children, actions } = $props();

  const variants = {
    default: 'bg-base-100 border-base-300 shadow-card',
    alt: 'bg-teal-50 border-teal-100',
    flat: 'bg-base-100 border-base-300'
  };
</script>

<div class="card rounded-box border {variants[variant]} {klass}">
  <div class="card-body {padding === 'lg' ? 'p-8' : 'p-6'} gap-4">
    {#if title}<h3 class="card-title font-display text-[1.0625rem]">{title}</h3>{/if}
    {@render children?.()}
    {#if actions}<div class="card-actions justify-end">{@render actions()}</div>{/if}
  </div>
</div>
