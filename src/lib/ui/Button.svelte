<script>
  /**
   * Button — daisyUI `btn`.
   * Renders <a> when `href` is set, otherwise <button>.
   * @type {{
   *   variant?: 'primary'|'secondary'|'accent'|'ghost'|'outline'|'error',
   *   size?: 'sm'|'md'|'lg',
   *   block?: boolean, loading?: boolean, disabled?: boolean,
   *   href?: string, type?: 'button'|'submit', form?: string, class?: string,
   *   children?: import('svelte').Snippet, onclick?: (e: MouseEvent) => void
   * }}
   */
  let {
    variant = 'primary',
    size = 'md',
    block = false,
    loading = false,
    disabled = false,
    href,
    type = 'button',
    class: klass = '',
    children,
    ...rest
  } = $props();

  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
    error: 'btn-error'
  };
  const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

  let cls = $derived(
    ['btn', variants[variant], sizes[size], block && 'btn-block', klass]
      .filter(Boolean)
      .join(' ')
  );
</script>

{#if href}
  <a {href} class={cls} aria-disabled={disabled || undefined} {...rest}>{@render children?.()}</a>
{:else}
  <button {type} class={cls} disabled={disabled || loading} {...rest}>
    {#if loading}<span class="loading loading-spinner loading-sm"></span>{/if}
    {@render children?.()}
  </button>
{/if}
