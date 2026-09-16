<script>
  import { Header, Footer, Button, Card } from '$lib/ui';
  import LeadForm from '$lib/components/LeadForm.svelte';
  import { CLINIC, CLINICS } from '$lib/constants';
  import { services } from '$lib/data';
  import { reveal } from '$lib/actions';

  let activeClinicId = $state(CLINICS[0].id);
  const activeClinic = $derived(CLINICS.find((c) => c.id === activeClinicId) ?? CLINICS[0]);

  const reasons = [
    { title: 'Equipa experiente', desc: 'Médicos dentistas dedicados ao seu conforto e bem-estar.' },
    { title: 'Marcações flexíveis', desc: 'Horários alargados para se ajustarem à sua rotina.' },
    { title: 'Ambiente acolhedor', desc: 'Uma clínica pensada para o deixar à vontade.' },
    { title: 'Tecnologia moderna', desc: 'Equipamento atualizado para diagnósticos mais precisos.' }
  ];

  const stats = [
    { value: '26', label: 'anos de clínica' },
    { value: '2', label: 'médicos dentistas' },
    { value: '+4 000', label: 'pacientes acompanhados' }
  ];

  const contact = [
    ['Morada', CLINIC.address],
    ['Telefone', CLINIC.phone],
    ['Email', CLINIC.email],
    ['Horário', CLINIC.hours]
  ];
</script>

<svelte:head>
  <title>Clínica Médica Dentária em Lisboa · CuidaDente</title>
  <meta
    name="description"
    content="Marque a sua consulta na CuidaDente. Equipa experiente, horários flexíveis, em Lisboa." />
</svelte:head>

<Header />

<main class="bg-base-100">
  <!-- Hero -->
  <section class="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_.85fr] lg:px-12 lg:py-24">
    <div class="flex flex-col gap-6 animate-fade-up">
      <h1 class="max-w-[32ch] text-balance" style="animation-delay:60ms">Uma equipa de confiança para cuidar do seu sorriso.</h1>
      <p class="max-w-[46ch] text-lg text-base-content/60" style="animation-delay:140ms">
        Deixe-nos os seus contactos e tratamos de encontrar o horário certo para a sua consulta — sem
        complicações.
      </p>
      <div class="flex flex-wrap gap-3" style="animation-delay:220ms">
        <Button href="#contacto" size="lg">Pedir contacto</Button>
        <Button href="#servicos" variant="ghost" size="lg">Ver serviços</Button>
      </div>
      <dl class="mt-4 flex flex-wrap gap-8 border-t border-base-300 pt-6" style="animation-delay:300ms">
        {#each stats as s (s.label)}
          <div>
            <dt class="font-display text-xl font-semibold">{s.value}</dt>
            <dd class="text-sm text-base-content/45">{s.label}</dd>
          </div>
        {/each}
      </dl>
    </div>
    <div class="photo-slot aspect-[3/4] animate-fade-in max-lg:aspect-[4/3]" style="animation-delay:200ms">
      <span class="rounded-lg bg-base-100 px-4 py-2 font-mono text-xs text-teal-700">foto da equipa clínica</span>
    </div>
  </section>

  <!-- Services -->
  <section id="servicos" class="mx-auto grid max-w-6xl gap-12 px-6 section-y lg:grid-cols-[.7fr_1.3fr] lg:px-12">
    <div>
      <h2>Os nossos serviços</h2>
      <p class="mt-3 max-w-[34ch] text-base-content/60">
        Cuidados dentários completos para toda a família, dos check-ups de rotina aos tratamentos mais
        específicos.
      </p>
    </div>
    <ul>
      {#each services as s, i (s.slug)}
        <li class="grid grid-cols-[3rem_1fr] gap-5 border-b border-base-300 py-5">
          <span class="font-display text-xl font-semibold text-base-300">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <h3>{s.title}</h3>
            <p class="mt-1 max-w-[58ch] text-sm text-base-content/60">{s.summary}</p>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <!-- Why us -->
  <section id="sobre" class="bg-teal-50 section-y">
    <div class="mx-auto max-w-6xl px-6 lg:px-12">
      <h2>Porquê escolher a CuidaDente</h2>
      <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {#each reasons as r (r.title)}
          <div class="border-l-2 border-teal-400 pl-4">
            <h3>{r.title}</h3>
            <p class="mt-2 text-sm text-base-content/60">{r.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Clínicas -->
  <section id="clinicas" class="bg-teal-50 section-y">
    <div class="mx-auto max-w-6xl px-6 lg:px-12">
      <div class="max-w-[46ch]">
        <p class="eyebrow">Onde estamos</p>
        <h2 class="mt-2">As nossas clínicas</h2>
        <p class="mt-3 text-base-content/60">
          Duas localizações para o servir ainda mais perto de si.
        </p>
      </div>

      <div class="mt-8">
        <div
          role="tablist"
          aria-label="Escolher clínica"
          class="inline-flex gap-1 rounded-full border border-base-300 bg-base-200 p-1">
          {#each CLINICS as c (c.id)}
            <button
              type="button"
              role="tab"
              id="tab-clinic-{c.id}"
              aria-selected={activeClinicId === c.id}
              aria-controls="panel-clinic"
              onclick={() => (activeClinicId = c.id)}
              class="rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 {activeClinicId ===
              c.id
                ? 'bg-primary text-primary-content shadow-card'
                : 'text-base-content/60 hover:text-base-content'}">
              {c.label}
            </button>
          {/each}
        </div>

        {#key activeClinicId}
          <div
            role="tabpanel"
            id="panel-clinic"
            aria-labelledby="tab-clinic-{activeClinic.id}"
            class="mt-6 grid animate-fade-up items-stretch gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div class="relative min-h-72 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-card">
              <iframe
                src={activeClinic.mapUrl}
                title="Mapa — {activeClinic.label}"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                class="absolute inset-x-0 top-0 h-[calc(100%+2.25rem)] w-full border-0"></iframe>
            </div>

            <div class="rounded-box border border-base-300 bg-base-100 p-6 shadow-card">
              <h3 class="font-display text-xl font-semibold">{activeClinic.label}</h3>
              <p class="mt-2 text-base-content/70">{activeClinic.address}</p>
              <dl class="mt-6 grid gap-4">
                <div>
                  <dt class="text-xs font-semibold uppercase tracking-wide text-base-content/45">Telefone</dt>
                  <dd class="mt-0.5">
                    <a href="tel:{activeClinic.phone.replace(/ /g, '')}" class="link link-hover font-semibold"
                      >{activeClinic.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-semibold uppercase tracking-wide text-base-content/45">Telemóvel</dt>
                  <dd class="mt-0.5">
                    <a href="tel:{activeClinic.mobile.replace(/ /g, '')}" class="link link-hover font-semibold"
                      >{activeClinic.mobile}</a>
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-semibold uppercase tracking-wide text-base-content/45">Horário</dt>
                  <dd class="mt-0.5">{activeClinic.hours}</dd>
                </div>
              </dl>
              <a
                href={activeClinic.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-outline btn-sm mt-6">Abrir no Google Maps ↗</a>
            </div>
          </div>
        {/key}
        <p class="mt-3 text-right text-xs text-base-content/40">© OpenStreetMap contributors</p>
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contacto" class="mx-auto grid max-w-6xl items-start gap-12 px-6 section-y lg:grid-cols-[.8fr_1.2fr] lg:px-12">
    <div class="flex flex-col gap-8">
      <div>
        <h2>Marque a sua consulta</h2>
        <p class="mt-3 max-w-[38ch] text-base-content/60">
          Preencha o formulário com os seus contactos. A nossa equipa liga-lhe de volta para combinar o
          melhor horário.
        </p>
      </div>
      <dl class="flex flex-col gap-6">
        {#each contact as [k, v] (k)}
          <div>
            <dt class="text-[0.8125rem] font-semibold text-base-content/45">{k}</dt>
            <dd class="mt-0.5">{v}</dd>
          </div>
        {/each}
      </dl>
    </div>
    <LeadForm />
  </section>
</main>

<Footer />
