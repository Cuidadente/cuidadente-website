import { json } from '@sveltejs/kit';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

/**
 * POST /api/leads — server-side proxy for the public appointment form.
 *
 * The browser only ever talks to THIS origin (`/api/leads`). This handler runs
 * inside the Cloudflare Worker and makes the actual request to the separate
 * API app's intake endpoint, server-to-server, so the visitor's browser never
 * calls the API directly (no CORS needed on the API app).
 *
 * Auth: the intake endpoint requires an `X-Lead-Key` header. The API key is
 * stored as a Cloudflare Worker secret (`INTAKE_LEADS_API_KEY`) and read here
 * at runtime from `event.platform.env` — it is never in `.env`, the repo, or
 * the client bundle.
 *
 * `PUBLIC_API_BASE_URL` is inlined at build time. It is only imported here (a
 * server module), so the value stays out of the client bundle in this path.
 */

const upstream = `${(PUBLIC_API_BASE_URL || '').replace(/\/+$/, '')}/api/v1/leads/public/intake`;

export async function POST({ request, fetch, platform }) {
	const apiKey = platform?.env?.INTAKE_LEADS_API_KEY;
	if (!apiKey) {
		return json({ message: 'Serviço indisponível. Tente novamente.' }, { status: 500 });
	}

	const body = await request.text();

	let res: Response;
	try {
		res = await fetch(upstream, {
			method: 'POST',
			headers: {
				'content-type': request.headers.get('content-type') ?? 'application/json',
				accept: 'application/json',
				'x-lead-key': apiKey
			},
			body
		});
	} catch {
		return json({ message: 'Não foi possível contactar o servidor. Tente novamente.' }, { status: 503 });
	}

	const data = await res.json().catch(() => ({}));
	return json(data, { status: res.status });
}
