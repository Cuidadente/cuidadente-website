<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Alert, Button, Card, TextInput } from '$lib/ui';
  import { CLINIC } from '$lib/constants';
  import { login, ApiError } from '$lib/api';

  let email = $state('');
  let password = $state('');
  let loading = $state(false);
  let error = $state('');

  const next = page.url.searchParams.get('next') ?? '/gestao';

  /** @param {SubmitEvent} e */
  async function onSubmit(e) {
    e.preventDefault();
    error = '';
    if (!email.trim() || !password) {
      error = 'Introduza o email e a palavra-passe.';
      return;
    }

    loading = true;
    try {
      const result = await login({ email: email.trim(), password, next });
      goto(result.next?.startsWith('/') ? result.next : next, { invalidateAll: true });
    } catch (err) {
      error = err instanceof ApiError ? err.message : 'Não foi possível entrar. Tente novamente.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head><title>Entrar — {CLINIC.name}</title><meta name="robots" content="noindex" /></svelte:head>

<main class="min-h-screen grid place-items-center bg-base-200 px-4 py-16">
  <div class="w-full max-w-sm">
    <a href="/" class="mb-8 flex items-center justify-center gap-3">
      <img src="/img/cuidadente-logo.png" alt="{CLINIC.name}" class="h-10 w-auto" />
    </a>

    <Card padding="lg">
      <h1 class="font-display text-2xl font-semibold text-base-content">Área reservada</h1>
      <p class="mt-1 mb-6 text-sm text-base-content/60">Acesso exclusivo à equipa da clínica.</p>

      {#if error}
        <div class="mb-4"><Alert tone="error">{error}</Alert></div>
      {/if}

      <form onsubmit={onSubmit} class="grid gap-4">
        <TextInput
          label="Email"
          name="email"
          type="email"
          required
          autocomplete="username"
          bind:value={email}
          placeholder="nome@cuidadente.pt"
        />
        <TextInput
          label="Palavra-passe"
          name="password"
          type="password"
          required
          autocomplete="current-password"
          bind:value={password}
        />
        <Button type="submit" block {loading}>Entrar</Button>
      </form>
    </Card>

    <p class="mt-6 text-center text-sm text-base-content/50">
      Problemas a entrar? <a href="/#contacto" class="link link-hover text-teal-600">Contacte-nos</a>
    </p>
  </div>
</main>
