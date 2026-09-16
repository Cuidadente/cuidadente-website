<script>
  import { page } from '$app/state';
  import { CLINICS } from '$lib/constants';
  import Button from './Button.svelte';

  /** @type {{ variant?: 'public'|'admin' }} */
  let { variant = 'public' } = $props();

  const links = [
    { href: '/#servicos', label: 'Serviços' },
    { href: '/#sobre', label: 'Equipa' },
    { href: '/#clinicas', label: 'Clínicas' },
    { href: '/#contacto', label: 'Contactos' }
  ];

  let open = $state(false);
  let path = $derived(page.url.pathname);
</script>

{#if variant === 'public'}
  <div class="hidden justify-between gap-4 bg-neutral px-6 py-2 text-xs text-neutral-content/90 md:flex lg:px-12">
    <span>{CLINICS.map((c) => c.label).join(' · ')}</span>
    <span>{CLINICS.map((c) => c.phone).join('  ·  ')}  ·  Seg–Sex, 9h00–19h00</span>
  </div>
{/if}

<header class="sticky top-0 z-20 border-b border-base-300 bg-base-100">
  <div class="flex items-center justify-between gap-6 px-6 py-4 lg:px-12">
    <a href="/" class="group shrink-0" aria-label="CuidaDente — página inicial">
      <img
        src="/CuidaDente_Logo/png/CuidaDente_Logotipo-01.png"
        alt="CuidaDente — Clínica Médica Dentária"
        class="block h-16 w-auto animate-fade-in transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.05]"
      />
    </a>

    <nav class="hidden items-center gap-8 md:flex">
      {#each links as l (l.href)}
        <a
          href={l.href}
          aria-current={path === l.href ? 'page' : undefined}
          class="nav-link text-sm transition-colors hover:text-teal-600 {path === l.href
            ? 'font-semibold text-teal-600'
            : 'text-base-content'}">{l.label}</a>
      {/each}
    </nav>

    <div class="flex items-center gap-2">
      <Button href="/#contacto" size="sm" class="max-md:hidden">Marcar consulta</Button>
      <button
        class="btn btn-ghost btn-sm md:hidden"
        aria-label="Abrir menu"
        aria-expanded={open}
        onclick={() => (open = !open)}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">
          <path d="M3 6h14M3 10h14M3 14h14" />
        </svg>
      </button>
    </div>
  </div>

  {#if open}
    <nav class="flex flex-col gap-1 border-t border-base-300 px-6 py-3 md:hidden">
      {#each links as l (l.href)}
        <a href={l.href} class="rounded-field px-3 py-2 text-sm hover:bg-teal-50" onclick={() => (open = false)}>{l.label}</a>
      {/each}
      <a href="/#contacto" class="btn btn-primary btn-sm mt-2" onclick={() => (open = false)}>Marcar consulta</a>
    </nav>
  {/if}
</header>
