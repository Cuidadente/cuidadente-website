<script>
  import { CLINIC } from '$lib/constants';
</script>

<svelte:head><title>Termos e Condições — {CLINIC.name}</title><meta name="robots" content="index,follow" /></svelte:head>

<div class="mx-auto max-w-3xl px-6 py-14 lg:px-12">
  <p class="eyebrow">Informação legal</p>
  <h1 class="mt-2">Termos e Condições</h1>
  <p class="mt-2 text-sm text-base-content/50">Última atualização: 2026</p>

  <div class="mt-8 grid gap-8 text-base-content/80">
    <section>
      <h2 class="text-display-sm mb-3">Âmbito</h2>
      <p>
        Estes termos regulam a utilização do website da {CLINIC.name}. Ao navegar no site e ao
        enviar pedidos de contacto, aceita as condições aqui descritas.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Pedidos de marcação</h2>
      <p>
        O formulário de contacto serve para pedir uma marcação. O seu envio não constitui uma
        confirmação automática: a nossa equipa entra em contacto para confirmar data e hora.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Informação clínica</h2>
      <p>
        O conteúdo do website tem caráter informativo e não substitui o aconselhamento médico
        profissional. Consulte sempre um médico dentista.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Responsabilidade e propriedade intelectual</h2>
      <p>
        Os conteúdos do site pertencem à {CLINIC.name}. Não nos responsabilizamos por danos
        resultantes de uma utilização indevida do website.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Lei aplicável</h2>
      <p>Estes termos regem-se pela legislação portuguesa.</p>
    </section>
  </div>
</div>
