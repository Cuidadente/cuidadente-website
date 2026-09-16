<script>
  /**
   * Stat — single KPI tile for the admin dashboard.
   * @type {{ value: string|number, label: string, tone?: 'default'|'accent', class?: string }}
   */
  let { value, label, tone = 'default', class: klass = '' } = $props();
</script>

<div class="rounded-box border border-base-300 bg-base-100 p-5 {klass}">
  <p class="font-display text-display-sm {tone === 'accent' ? 'text-teal-600' : ''}">{value}</p>
  <p class="mt-1 text-sm text-base-content/50">{label}</p>
</div>
