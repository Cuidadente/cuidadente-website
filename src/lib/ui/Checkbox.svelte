<script>
  /**
   * Checkbox — daisyUI `checkbox` in an inline label. Used for consent + filters.
   * @type {{ label?: string, name: string, checked?: boolean, required?: boolean,
   *          error?: string, class?: string, children?: import('svelte').Snippet }}
   */
  let { label, name, checked = $bindable(false), required = false, error, class: klass = '', children } = $props();
</script>

<div class="form-control {klass}">
  <label class="flex cursor-pointer items-start gap-3" for={name}>
    <input
      id={name}
      {name}
      type="checkbox"
      value="1"
      {required}
      bind:checked
      aria-invalid={error ? 'true' : undefined}
      class="checkbox checkbox-secondary mt-0.5 shrink-0 {error ? 'border-error' : ''}"
    />
    <span class="text-[0.8125rem] leading-snug">
      {#if children}{@render children()}{:else}{label}{/if}
    </span>
  </label>
  {#if error}<p class="mt-1 text-xs text-error" role="alert">{error}</p>{/if}
</div>
