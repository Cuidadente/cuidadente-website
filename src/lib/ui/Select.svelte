<script>
  import Field from './Field.svelte';
  /**
   * Select — Field + daisyUI `select`.
   * @type {{ label: string, name: string, value?: string,
   *          options?: ReadonlyArray<{ value: string, label: string }>,
   *          placeholder?: string, required?: boolean, hint?: string,
   *          error?: string, class?: string }}
   */
  let {
    label, name, value = $bindable(''), options = [],
    placeholder = 'Selecionar', required = false, hint, error, class: klass = '', ...rest
  } = $props();
</script>

<Field {label} id={name} {required} {hint} {error} class={klass}>
  <select
    id={name}
    {name}
    {required}
    bind:value
    aria-invalid={error ? 'true' : undefined}
    class="select select-bordered w-full {error ? 'select-error' : ''}"
    {...rest}
  >
    <option value="" disabled={required}>{placeholder}</option>
    {#each options as o (o.value)}
      <option value={o.value}>{o.label}</option>
    {/each}
  </select>
</Field>
