<script>
  /**
   * Field — label + control slot + hint/error. Wrap every input with this so
   * labels, required marks and error copy stay consistent.
   * @type {{ label: string, id: string, required?: boolean, hint?: string,
   *          error?: string, class?: string, children?: import('svelte').Snippet }}
   */
  let { label, id, required = false, hint, error, class: klass = '', children } = $props();
</script>

<div class="form-control w-full {klass}">
  <label class="label pb-1" for={id}>
    <span class="label-text text-[0.8125rem] font-semibold">
      {label}{#if required}<span class="ml-0.5 text-error">*</span>{/if}
    </span>
  </label>
  {@render children?.()}
  {#if error}
    <p class="mt-1 text-xs text-error" id="{id}-error" role="alert">{error}</p>
  {:else if hint}
    <p class="mt-1 text-xs text-base-content/50">{hint}</p>
  {/if}
</div>
