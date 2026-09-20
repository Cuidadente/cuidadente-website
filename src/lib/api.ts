// ---------------------------------------------------------------------------
// CuidaDente API client.
//
// The frontend is a static SPA: pages render from local/static data
// (`src/lib/data.ts`) and NEVER call the API just to show a page. The only
// network traffic this app makes is from FORM SUBMITS, which call the
// endpoints below on a separate API app.
//
// Configure the API base URL with a PUBLIC_API_BASE_URL environment variable
// (e.g. in a local `.env` or in Vercel's project settings):
//   PUBLIC_API_BASE_URL=https://api.cuidadente.pt
//
// The endpoints below define the contract the separate API app must implement.
// Every call returns the parsed JSON body. On a non-2xx response it throws an
// `ApiError` whose `.fieldErrors` / `.message` can be shown inline in a form.
// ---------------------------------------------------------------------------

import { PUBLIC_API_BASE_URL } from '$env/static/public';

const FALLBACK_API_BASE_URL = 'http://localhost:8787';

export const API_BASE_URL: string = PUBLIC_API_BASE_URL?.trim() || FALLBACK_API_BASE_URL;

export class ApiError extends Error {
	fieldErrors: Record<string, string>;
	status: number;

	constructor(message: string, fieldErrors: Record<string, string> = {}, status = 0) {
		super(message);
		this.name = 'ApiError';
		this.fieldErrors = fieldErrors;
		this.status = status;
	}
}

interface ApiFailureBody {
	message?: string;
	fieldErrors?: Record<string, string>;
}

/**
 * Thin fetch wrapper: JSON in/out, throws `ApiError` on non-2xx.
 * `fieldErrors` maps input field names to human-readable messages (pt-PT),
 * so forms can render `error={...}` on the matching field.
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
	let res: Response;
	try {
		res = await fetch(`${API_BASE_URL}${path}`, {
			headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
			...init
		});
	} catch {
		throw new ApiError('Não foi possível contactar o servidor. Tente novamente.');
	}

	if (res.status === 204) return undefined as T;

	const body = (await res.json().catch(() => ({}))) as T & ApiFailureBody;

	if (!res.ok) {
		throw new ApiError(
			body?.message ?? 'Ocorreu um erro. Tente novamente.',
			body?.fieldErrors ?? {},
			res.status
		);
	}

	return body;
}

function post<T>(path: string, payload: unknown): Promise<T> {
	return request<T>(path, { method: 'POST', body: JSON.stringify(payload) });
}

// ---------------------------------------------------------------------------
// Public — lead request form (`/+page.svelte` → LeadForm)
// ---------------------------------------------------------------------------

export interface SubmitLeadPayload {
	full_name: string;
	phone: string;
	email: string; // required on this intake path
	/** Human-readable consultation motive (e.g. "Ortodontia"). */
	motive: string;
	/** Free-text description (clinic preference is prefixed); null when empty. */
	description: string | null;
	/** Preferred weekdays as English slugs, e.g. ['tue', 'thu']. ≤7. */
	availability_days?: string[];
	/** Preferred slot: 'morning' | 'afternoon'. */
	availability_slot?: string;
}

export interface SubmitLeadResult {
	ok: true;
	firstName?: string;
}

/**
 * POST {base}/leads — submits the public appointment form.
 *
 * This posts to the same-origin `/api/leads` proxy route (handled by the
 * Cloudflare Worker), which forwards the request to the separate API app
 * server-side. The browser never talks to the API app directly.
 */
export async function submitLead(payload: SubmitLeadPayload): Promise<SubmitLeadResult> {
	let res: Response;
	try {
		res = await fetch('/api/leads', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
	} catch {
		throw new ApiError('Não foi possível contactar o servidor. Tente novamente.');
	}

	const body = (await res.json().catch(() => ({}))) as (SubmitLeadResult & ApiFailureBody) | {};

	if (!res.ok) {
		const b = body as Partial<ApiFailureBody>;
		throw new ApiError(
			b?.message ?? 'Ocorreu um erro. Tente novamente.',
			b?.fieldErrors ?? {},
			res.status
		);
	}

	return body as SubmitLeadResult;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export interface LoginPayload {
	email: string;
	password: string;
	next?: string;
}

export interface LoginResult {
	ok: true;
	user: { name: string; email: string; role: string };
	next?: string;
}

/** POST {base}/auth/login */
export function login(payload: LoginPayload): Promise<LoginResult> {
	return post<LoginResult>('/auth/login', payload);
}

/** POST {base}/auth/logout — fire-and-forget; navigation is client-side. */
export function logout(): Promise<{ ok: true }> {
	return post<{ ok: true }>('/auth/logout', {});
}

// ---------------------------------------------------------------------------
// Leads (gestão)
// ---------------------------------------------------------------------------

export interface UpdateLeadStatusPayload {
	status: string;
}
/** PATCH {base}/leads/{id}/status */
export function updateLeadStatus(id: string, payload: UpdateLeadStatusPayload): Promise<{ ok: true }> {
	return request(`/leads/${encodeURIComponent(id)}/status`, {
		method: 'PATCH',
		body: JSON.stringify(payload)
	});
}

export interface AddLeadNotePayload {
	body: string;
}
/** POST {base}/leads/{id}/notes */
export function addLeadNote(id: string, payload: AddLeadNotePayload): Promise<{ ok: true }> {
	return post(`/leads/${encodeURIComponent(id)}/notes`, payload);
}

// ---------------------------------------------------------------------------
// Appointments (gestão)
// ---------------------------------------------------------------------------

export interface CreateAppointmentPayload {
	leadId?: string;
	patientName: string;
	date: string; // YYYY-MM-DD
	time: string; // HH:mm
	durationMin: number;
	doctorId?: string;
	notes?: string;
}
/** POST {base}/appointments */
export function createAppointment(payload: CreateAppointmentPayload): Promise<{ ok: true }> {
	return post('/appointments', payload);
}

/** POST {base}/appointments/{id}/cancel */
export function cancelAppointment(id: string): Promise<{ ok: true }> {
	return post(`/appointments/${encodeURIComponent(id)}/cancel`, {});
}

// ---------------------------------------------------------------------------
// Users (gestão)
// ---------------------------------------------------------------------------

export interface CreateUserPayload {
	name: string;
	email: string;
	password: string;
	role: string;
}
/** POST {base}/users */
export function createUser(payload: CreateUserPayload): Promise<{ ok: true }> {
	return post('/users', payload);
}

/** PATCH {base}/users/{id}/active */
export function setUserActive(id: string, active: boolean): Promise<{ ok: true }> {
	return request(`/users/${encodeURIComponent(id)}/active`, {
		method: 'PATCH',
		body: JSON.stringify({ active })
	});
}
