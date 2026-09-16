<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Badge } from '$lib/ui';
  import { ROLES, CLINIC } from '$lib/constants';
  import { currentUser } from '$lib/data';
  import { logout } from '$lib/api';

  let { children } = $props();

  /** @type {Array<{ href: string, label: string, role?: 'admin' }>} */
  const nav = [
    { href: '/gestao', label: 'Painel' },
    { href: '/gestao/pedidos', label: 'Pedidos' },
    { href: '/gestao/marcacoes', label: 'Marcações' },
    { href: '/gestao/utilizadores', label: 'Utilizadores', role: 'admin' }
  ];

  let path = $derived(page.url.pathname);
  let visible = $derived(
    nav.filter((i) => !i.role || ROLES[currentUser.role].level >= ROLES[i.role].level)
  );
  /** @type {(href: string) => boolean} */
  const isActive = (href) => (href === '/gestao' ? path === href : path.startsWith(href));

  // Client-side logout: notify the API (best effort) and return to the home page.
  async function handleLogout() {
    try {
      await logout();
    } catch {
      // The API being unreachable should not block signing out locally.
    }
    goto('/');
  }
</script>

<div class="min-h-screen bg-base-200 lg:grid lg:grid-cols-[15rem_1fr]">
  <aside class="bg-neutral text-neutral-content lg:min-h-screen">
    <div class="flex items-center justify-between gap-4 px-5 py-5 lg:block">
      <a href="/gestao" class="font-display text-lg font-semibold tracking-tight">{CLINIC.name}</a>
      <span class="hidden text-xs uppercase tracking-[0.14em] text-neutral-content/50 lg:mt-1 lg:block">Gestão</span>
    </div>

    <nav class="flex gap-1 overflow-x-auto px-3 pb-3 lg:mt-2 lg:flex-col lg:overflow-visible">
      {#each visible as item (item.href)}
        <a
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
          class="min-h-11 shrink-0 rounded-field px-4 py-2.5 text-sm font-semibold transition-colors
                 {isActive(item.href)
                   ? 'bg-neutral-content/12 text-neutral-content'
                   : 'text-neutral-content/65 hover:bg-neutral-content/8 hover:text-neutral-content'}"
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="mt-auto hidden border-t border-neutral-content/10 px-5 py-5 lg:block">
      <p class="truncate text-sm font-semibold">{currentUser.name}</p>
      <p class="mt-1"><Badge tone="accent">{ROLES[currentUser.role].label}</Badge></p>
      <button type="button" onclick={handleLogout} class="min-h-11 text-sm font-semibold text-neutral-content/65 hover:text-neutral-content">
        Sair
      </button>
    </div>
  </aside>

  <main class="px-5 py-8 lg:px-10 lg:py-12">
    <div class="mx-auto max-w-6xl">{@render children()}</div>
  </main>
</div>
