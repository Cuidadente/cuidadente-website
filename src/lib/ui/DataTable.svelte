<script>
  /**
   * DataTable — shell for admin lists. Pass column labels and a row snippet.
   * @type {{ columns: string[], empty?: string,
   *          rows?: import('svelte').Snippet, isEmpty?: boolean, class?: string }}
   */
  let { columns = [], empty = 'Sem registos.', rows, isEmpty = false, class: klass = '' } = $props();
</script>

<div class="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-card {klass}">
  <table class="table">
    <thead>
      <tr class="bg-base-200">
        {#each columns as c (c)}
          <th class="text-xs font-semibold uppercase tracking-[0.08em] text-base-content/45">{c}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if isEmpty}
        <tr><td colspan={columns.length} class="py-12 text-center text-sm text-base-content/45">{empty}</td></tr>
      {:else}
        {@render rows?.()}
      {/if}
    </tbody>
  </table>
</div>
