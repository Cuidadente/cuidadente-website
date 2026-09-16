<script lang="ts">
	import '../app.css';
	import CookieConsent from '$lib/components/CookieConsent.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
	<link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>

{@render children()}
<CookieConsent />