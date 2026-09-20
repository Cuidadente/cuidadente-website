// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				/** Secret API key (Cloudflare secret) used to authenticate lead intake. */
				INTAKE_LEADS_API_KEY?: string;
			};
		}
	}
}

export {};
