<script>
  import { onMount } from 'svelte';

  const STORAGE_KEY = 'cuidadente-cookie-consent';

  let visible = $state(false);

  onMount(() => {
    // Only prompt when no preference has been recorded yet.
    if (!localStorage.getItem(STORAGE_KEY)) visible = true;
  });

  /** @param {'accepted' | 'declined'} value */
  function choose(value) {
    localStorage.setItem(STORAGE_KEY, value);
    visible = false;
  }
</script>

{#if visible}
  <div class="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:max-w-md">
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      class="animate-fade-up rounded-box border border-base-300 bg-base-100 p-5 shadow-float">
      <p class="font-display text-base font-semibold text-base-content">Utilizamos cookies</p>
      <p class="mt-1 text-sm text-base-content/70">
        Usamos cookies para garantir o funcionamento do site e melhorar a sua experiência. Saiba mais na
        <a href="/cookies" class="link link-hover text-teal-600">Política de cookies</a>.
      </p>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onclick={() => choose('accepted')} class="btn btn-primary btn-sm">
          Aceitar
        </button>
        <button type="button" onclick={() => choose('declined')} class="btn btn-ghost btn-sm">
          Recusar
        </button>
      </div>
    </div>
  </div>
{/if}
