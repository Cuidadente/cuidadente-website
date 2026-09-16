<script>
  import Field from './Field.svelte';
  /**
   * Textarea — Field + daisyUI `textarea`.
   * @type {{ label: string, name: string, value?: string, rows?: number,
   *          placeholder?: string, required?: boolean, hint?: string,
   *          error?: string, maxlength?: number, class?: string }}
   */
  let {
    label, name, value = $bindable(''), rows = 3, placeholder,
    required = false, hint, error, maxlength, class: klass = '', ...rest
  } = $props();
</script>

<Field {label} id={name} {required} {hint} {error} class={klass}>
  <textarea
    id={name}
    {name}
    {rows}
    {placeholder}
    {required}
    {maxlength}
    bind:value
    aria-invalid={error ? 'true' : undefined}
    class="textarea textarea-bordered w-full leading-relaxed {error ? 'textarea-error' : ''}"
    {...rest}
  ></textarea>
</Field>
