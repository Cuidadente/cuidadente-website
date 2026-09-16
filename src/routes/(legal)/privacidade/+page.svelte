<script>
  import { CLINIC } from '$lib/constants';
</script>

<svelte:head><title>Política de Privacidade — {CLINIC.name}</title><meta name="robots" content="index,follow" /></svelte:head>

<div class="mx-auto max-w-3xl px-6 py-14 lg:px-12">
  <p class="eyebrow">Informação legal</p>
  <h1 class="mt-2">Política de Privacidade</h1>
  <p class="mt-2 text-sm text-base-content/50">Última atualização: 2026</p>

  <div class="mt-8 grid gap-8 text-base-content/80">
    <section>
      <h2 class="text-display-sm mb-3">Quem trata os seus dados</h2>
      <p>
        A <strong>{CLINIC.name}</strong> é a entidade responsável pelo tratamento dos dados recolhidos
        através deste website. Pode contactar-nos pelo email <a href="mailto:{CLINIC.email}" class="link link-hover">{CLINIC.email}</a>.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Que dados recolhemos</h2>
      <p>Ao preencher o formulário de contacto, recolhemos apenas os dados que nos indica:</p>
      <ul class="mt-3 grid list-disc gap-1 pl-5">
        <li>Nome completo;</li>
        <li>Telefone e, opcionalmente, email;</li>
        <li>Motivo da consulta e mensagem;</li>
        <li>Preferência de horário e de clínica.</li>
      </ul>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Finalidade e base legal</h2>
      <p>
        Os dados são utilizados exclusivamente para responder ao seu pedido de marcação e para gerir a
        sua consulta. O tratamento baseia-se no seu consentimento e em diligências pré-contratuais
        (art. 6.º, n.º 1, alíneas a) e b) do RGPD).
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Conservação e partilha</h2>
      <p>
        Conservamos os dados apenas durante o tempo necessário para tratar o pedido e cumprir
        obrigações legais. Não partilhamos os seus dados com terceiros, exceto quando exigido por lei.
      </p>
    </section>

    <section>
      <h2 class="text-display-sm mb-3">Os seus direitos</h2>
      <p>
        Tem direito a aceder, retificar, apagar, limitar e portar os seus dados, bem como a opor-se ao
        tratamento. Para exercer qualquer direito, escreva-nos para
        <a href="mailto:{CLINIC.email}" class="link link-hover">{CLINIC.email}</a>. Pode ainda apresentar
        reclamação à CNPD.
      </p>
    </section>
  </div>
</div>
