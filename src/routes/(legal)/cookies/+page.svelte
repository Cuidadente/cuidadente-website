<script>
  import { CLINIC } from '$lib/constants';
</script>

<svelte:head><title>Política de Cookies — {CLINIC.name}</title><meta name="robots" content="index,follow" /></svelte:head>

<div class="mx-auto max-w-3xl px-6 py-14 lg:px-12">
  <p class="eyebrow">Informação legal</p>
  <h1 class="mt-2">Política de Cookies</h1>
  <p class="mt-2 text-sm text-base-content/50">Última atualização: 2026</p>

  <div class="mt-8 grid gap-8 text-base-content/80">
    <section>
      <h2 class="text-display-sm mb-3">O que são cookies</h2>
      <p>
        Os cookies são pequenos ficheiros de texto guardados no seu dispositivo que ajudam o site a
        funcionar e a recordar as suas preferências.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Que cookies utilizamos</h2>
      <ul class="grid list-disc gap-1 pl-5">
        <li><strong>Essenciais</strong> — necessários ao funcionamento básico do site;</li>
        <li><strong>Preferências</strong> — guardam escolhas como o idioma;</li>
        <li><strong>Estatística</strong> — ajudam-nos a perceber como o site é utilizado (de forma anónima).</li>
      </ul>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Como gerir</h2>
      <p>
        Pode configurar ou bloquear cookies nas definições do seu navegador. Tenha em conta que
        bloquear cookies essenciais pode afetar o funcionamento do site.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Contacto</h2>
      <p>
        Para qualquer questão sobre esta política, escreva-nos para
        <a href="mailto:{CLINIC.email}" class="link link-hover">{CLINIC.email}</a>.
      </p>
    </section>
  </div>
</div>
