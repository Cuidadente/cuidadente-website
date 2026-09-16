<script>
	import { page } from '$app/state';
	import { Button } from '$lib/ui';

	/** @type {Partial<Record<number, { title: string, body: string }>>} */
	const copy = {
		403: { title: 'Sem permissões', body: 'A sua conta não tem acesso a esta área da gestão.' },
		404: {
			title: 'Página não encontrada',
			body: 'O endereço que procura não existe ou foi movido.'
		}
	};
	let text = $derived(
		copy[page.status] ?? {
			title: 'Algo falhou',
			body: 'Ocorreu um erro inesperado. Tente novamente em instantes.'
		}
	);
</script>

<svelte:head><title>{text.title} — CuidaDente</title></svelte:head>

<main class="bg-base-200 grid min-h-screen place-items-center px-6 text-center">
	<div class="max-w-md">
		<p class="font-display text-gold-400 text-6xl font-semibold">{page.status}</p>
		<h1 class="font-display text-base-content mt-4 text-3xl font-semibold">{text.title}</h1>
		<p class="text-base-content/70 mt-3" style="text-wrap: pretty">{text.body}</p>
		<div class="mt-8 flex justify-center gap-3">
			<Button href="/">Voltar ao início</Button>
			<Button href="/#contacto" variant="outline">Contactos</Button>
		</div>
	</div>
</main>
