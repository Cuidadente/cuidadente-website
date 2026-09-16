<script>
  import Field from './Field.svelte';
  /**
   * TextInput — Field + daisyUI `input`. Two-way bindable.
   * @type {{ label: string, name: string, value?: string, type?: string,
   *          placeholder?: string, required?: boolean, hint?: string,
   *          error?: string, autocomplete?: import('svelte/elements').HTMLInputAttributes['autocomplete'],
   *          class?: string }}
   */
  let {
    label, name, value = $bindable(''), type = 'text', placeholder,
    required = false, hint, error, autocomplete, class: klass = '', ...rest
  } = $props();
</script>

<Field {label} id={name} {required} {hint} {error} class={klass}>
  <input
    id={name}
    {name}
    {type}
    {placeholder}
    {required}
    {autocomplete}
    bind:value
    aria-invalid={error ? 'true' : undefined}
    aria-describedby={error ? `${name}-error` : undefined}
    class="input input-bordered w-full {error ? 'input-error' : ''}"
    {...rest}
  />
</Field>
