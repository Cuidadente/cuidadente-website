<script>
  /**
   * Modal — native <dialog> via daisyUI. Controlled by `open`.
   * Closing sets `open = false`; Esc and backdrop click are handled.
   * @type {{ open?: boolean, title: string, class?: string,
   *          children?: import('svelte').Snippet, actions?: import('svelte').Snippet }}
   */
  let { open = $bindable(false), title, class: klass = '', children, actions } = $props();
  let dialog = $state();

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  });
</script>

<dialog bind:this={dialog} class="modal" onclose={() => (open = false)}>
  <div class="modal-box rounded-box max-w-lg p-8 shadow-float {klass}">
    <h2 class="font-display text-2xl font-semibold">{title}</h2>
    <div class="mt-3 space-y-4 text-sm">{@render children?.()}</div>
    <div class="modal-action mt-8">
      {#if actions}
        {@render actions()}
      {:else}
        <button class="btn btn-ghost" onclick={() => (open = false)}>Fechar</button>
      {/if}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop"><button aria-label="Fechar">close</button></form>
</dialog>
