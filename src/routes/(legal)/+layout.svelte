<script>
  import { Header, Footer } from '$lib/ui';

  let { children } = $props();
</script>

<Header />
<main class="min-h-[65vh] bg-base-100">{@render children()}</main>
<Footer />
