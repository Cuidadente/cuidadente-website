// Central configuration + domain constants for the CuidaDente clinic.

/** A physical clinic location. */
export type Clinic = {
	id: string;
	label: string;
	address: string;
	phone: string;
	mobile: string;
	hours: string;
	/** OpenStreetMap embed iframe src (bbox + marker). */
	mapUrl: string;
	/** Google Maps link (opens in the Maps app / device default on mobile). */
	mapLink: string;
};

/** The brand's two clinic locations. */
export const CLINICS: Clinic[] = [
	{
		id: 'areeiro',
		label: 'Areeiro',
		address: 'Avenida de Madrid, 1B — 1000-193 Lisboa',
		phone: '218 282 008',
		mobile: '929 272 500',
		hours: 'Seg–Sex, 9h00–19h00',
		mapUrl:
			'https://www.openstreetmap.org/export/embed.html?bbox=-9.13930%2C38.74060%2C-9.13330%2C38.74660&layer=mapnik&marker=38.743389%2C-9.134062',
		mapLink: 'https://maps.app.goo.gl/gU9CfHSncz8r1NwD6'
	},
	{
		id: 'prior-velho',
		label: 'Prior Velho',
		address: 'Rua de Moçambique, 76 — 2685-356 Prior Velho',
		phone: '219 403 086',
		mobile: '932 027 503',
		hours: 'Seg–Sex, 9h00–19h00',
		mapUrl:
			'https://www.openstreetmap.org/export/embed.html?bbox=-9.12220%2C38.78690%2C-9.11620%2C38.79290&layer=mapnik&marker=38.789971%2C-9.120656',
		mapLink: 'https://maps.app.goo.gl/KJ1dQKiHchbE897i9'
	}
];

/** Brand-wide + primary-clinic info (single-clinic references). */
export const CLINIC = {
	name: 'CuidaDente',
	address: CLINICS[0].address,
	phone: CLINICS[0].phone,
	email: 'geral@cuidadente.pt',
	hours: 'Seg–Sex, 9h00–19h00'
} as const;

/**
 * Access roles. `level` drives which nav items a role may see (admin > staff).
 * `label` is the Portuguese display name.
 */
export const ROLES = {
	admin: { label: 'Administrador', level: 100 },
	staff: { label: 'Equipa', level: 10 }
} as const;

export type Role = keyof typeof ROLES;

/** Consultation reasons offered on the public lead form. */
export const SERVICE_OPTIONS = [
	{ value: 'checkup', label: 'Check-up / consulta de rotina' },
	{ value: 'limpeza', label: 'Higiene e limpeza oral' },
	{ value: 'dentistica', label: 'Obturação (dentística)' },
	{ value: 'ortodontia', label: 'Ortodontia / aparelho' },
	{ value: 'implantes', label: 'Implantes dentários' },
	{ value: 'protese', label: 'Prótese dentária' },
	{ value: 'endodontia', label: 'Endodontia (canal)' },
	{ value: 'cirurgia', label: 'Cirurgia oral' }
] as const;

/** Preferred time of day for the appointment slot. */
export const PREFERENCE_OPTIONS = [
	{ value: 'manha', label: 'Manhã' },
	{ value: 'tarde', label: 'Tarde' },
	{ value: 'indiferente', label: 'Indiferente' }
] as const;

/** Preferred weekdays for the appointment (multi-select). */
export const DAY_OPTIONS = [
	{ value: 'seg', label: 'Seg' },
	{ value: 'ter', label: 'Ter' },
	{ value: 'qua', label: 'Qua' },
	{ value: 'qui', label: 'Qui' },
	{ value: 'sex', label: 'Sex' },
	{ value: 'sab', label: 'Sáb' },
	{ value: 'dom', label: 'Dom' }
] as const;

/**
 * Lifecycle of a lead. Values are lowercase slugs matching Badge's status map;
 * the UI capitalises them for display.
 */
export const LEAD_STATUSES = ['novo', 'contactado', 'marcado', 'fechado'] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
