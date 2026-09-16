<script>
  import { CLINIC, CLINICS } from '$lib/constants';

  const year = new Date().getFullYear();
</script>

<footer class="bg-neutral text-neutral-content">
  <div class="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
    <!-- Brand -->
    <div>
      <p class="font-display text-lg font-semibold">{CLINIC.name}</p>
      <p class="mt-3 text-sm leading-relaxed opacity-70">
        Clínica médico-dentária com duas localizações em Lisboa, focada no seu conforto e bem-estar.
      </p>
    </div>

    <!-- Clínicas -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-wider opacity-50">Clínicas</p>
      <ul class="mt-4 grid gap-4 text-sm">
        {#each CLINICS as c (c.id)}
          <li>
            <p class="font-semibold">{c.label}</p>
            <p class="opacity-70">{c.address}</p>
            <a href="tel:{c.phone.replace(/ /g, '')}" class="link link-hover opacity-70">{c.phone}</a>
          </li>
        {/each}
      </ul>
    </div>

    <!-- Contactos -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-wider opacity-50">Contactos</p>
      <ul class="mt-4 grid gap-3 text-sm">
        <li><a href="mailto:{CLINIC.email}" class="link link-hover">{CLINIC.email}</a></li>
        <li class="opacity-70">{CLINIC.hours}</li>
      </ul>
    </div>

    <!-- Legal -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-wider opacity-50">Informação legal</p>
      <ul class="mt-4 grid gap-3 text-sm">
        <li><a href="/privacidade" class="link link-hover">Política de privacidade</a></li>
        <li><a href="/termos" class="link link-hover">Termos e condições</a></li>
        <li><a href="/cookies" class="link link-hover">Política de cookies</a></li>
      </ul>
    </div>
  </div>

  <div class="border-t border-neutral-content/10">
    <div
      class="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs opacity-60 sm:flex-row sm:items-center sm:justify-between lg:px-12">
      <span>© {year} {CLINIC.name} — Clínica Médica Dentária. Todos os direitos reservados.</span>
      <span>
        Os dados recolhidos são tratados de acordo com o
        <a href="/privacidade" class="underline underline-offset-2 hover:opacity-100">RGPD</a>.
      </span>
    </div>
  </div>
</footer>
