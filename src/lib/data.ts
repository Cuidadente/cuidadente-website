// ---------------------------------------------------------------------------
// CuidaDente — static client-side data.
//
// The frontend is a static SPA: pages render from these local constants so
// viewing any page makes ZERO network requests. The separate API app (see
// `src/lib/api.ts`) is only contacted when a form is submitted.
//
// These values are demo stand-ins for what the API would return. Pages that
// mutate data (notas, marcações, utilizadores) copy these into local `$state`
// and update them optimistically after a successful API call.
// ---------------------------------------------------------------------------

import type { LeadStatus, Role } from './constants';

export interface User {
	id: string;
	name: string;
	email: string;
	role: Role;
	active: boolean;
	createdAt: string;
}

export interface Lead {
	id: string;
	name: string;
	phone: string;
	email?: string;
	serviceSlug: string;
	preference: string;
	clinic?: string;
	message?: string;
	status: LeadStatus;
	createdAt: string;
	consentAt: string;
}

export interface LeadNote {
	id: string;
	leadId: string;
	body: string;
	authorName: string;
	createdAt: string;
}

export interface Appointment {
	id: string;
	startsAt: string; // ISO date-time
	durationMin: number;
	patientName: string;
	doctorId?: string;
	doctorName?: string;
	status: 'agendada' | 'concluida' | 'cancelada' | 'falta';
}

export interface Doctor {
	id: string;
	name: string;
}

function daysAgo(n: number, hour = 10, minute = 0): string {
	const d = new Date();
	d.setDate(d.getDate() - n);
	d.setHours(hour, minute, 0, 0);
	return d.toISOString();
}

function daysFromNow(n: number, hour = 10, minute = 0): string {
	const d = new Date();
	d.setDate(d.getDate() + n);
	d.setHours(hour, minute, 0, 0);
	return d.toISOString();
}

export const currentUser: User = {
	id: 'u-admin',
	name: 'Marta Silva',
	email: 'admin@cuidadente.pt',
	role: 'admin',
	active: true,
	createdAt: daysAgo(400)
};

export const services = [
	{ slug: 'cirurgia-oral', title: 'Cirurgia Oral', summary: 'Extrações e pequenas cirurgias orais com segurança e conforto.' },
	{ slug: 'sisos-inclusos', title: 'Sisos inclusos', summary: 'Extração de sisos (terceiros molares) inclusos com planeamento cuidadoso.' },
	{ slug: 'implantologia', title: 'Implantologia', summary: 'Substituição de dentes em falta com implantes e soluções duradouras.' },
	{ slug: 'ortodontia', title: 'Ortodontia', summary: 'Alinhamentos e aparelhos para corrigir o posicionamento dos dentes.' },
	{ slug: 'patologia-oral', title: 'Patologia oral e biópsias', summary: 'Diagnóstico e tratamento de lesões e doenças da cavidade oral.' },
	{ slug: 'endodontia', title: 'Endodontia', summary: 'Tratamento de canal para recuperar dentes com lesões profundas.' },
	{ slug: 'dentisteria', title: 'Dentisteria', summary: 'Restaurações e obturações estéticas e funcionais.' },
	{ slug: 'prostodontia-fixa', title: 'Prostodontia fixa', summary: 'Coroa, pontes e próteses fixas para repor dentes em falta.' },
	{ slug: 'prostodontia-removivel', title: 'Prostodontia removível', summary: 'Próteses removíveis para uma mastigação confortável.' },
	{ slug: 'periodontologia', title: 'Periodontologia', summary: 'Tratamento das gengivas e prevenção da doença periodontal.' },
	{ slug: 'oclusao', title: 'Oclusão', summary: 'Avaliação e tratamento do equilíbrio da mordida e das articulações.' },
	{ slug: 'odontopediatria', title: 'Odontopediatria', summary: 'Cuidados dentários adaptados às crianças.' },
	{ slug: 'harmonizacao-orofacial', title: 'Harmonização orofacial', summary: 'Procedimentos estéticos faciais em harmonia com a sua saúde oral.' }
];

export const doctors: Doctor[] = [
	{ id: 'd-ana', name: 'Dra. Ana Costa' },
	{ id: 'd-jo', name: 'Dr. João Pereira' },
	{ id: 'd-carla', name: 'Dra. Carla Mendes' }
];

export const leads: Lead[] = [
	{
		id: 'l-1',
		name: 'Inês Ferreira',
		phone: '912 345 678',
		email: 'ines.ferreira@example.com',
		serviceSlug: 'checkup',
		preference: 'manha',
		clinic: 'areeiro',
		message: 'Gostaria de marcar um check-up para a minha mãe, se possível.',
		status: 'novo',
		createdAt: daysAgo(1, 9, 12),
		consentAt: daysAgo(1, 9, 12)
	},
	{
		id: 'l-2',
		name: 'Bruno Almeida',
		phone: '965 432 198',
		email: 'bruno.almeida@example.com',
		serviceSlug: 'ortodontia',
		preference: 'tarde',
		clinic: 'prior-velho',
		status: 'contactado',
		createdAt: daysAgo(2, 15, 4),
		consentAt: daysAgo(2, 15, 4)
	},
	{
		id: 'l-3',
		name: 'Sofia Martins',
		phone: '911 000 222',
		serviceSlug: 'limpeza',
		preference: 'indiferente',
		clinic: 'areeiro',
		message: 'Primeira vez em clínicas dentárias, prefiro um atendimento mais calmo.',
		status: 'marcado',
		createdAt: daysAgo(4, 11, 40),
		consentAt: daysAgo(4, 11, 40)
	}
];

export const notes: LeadNote[] = [
	{
		id: 'n-1',
		leadId: 'l-2',
		body: 'Contactado por telefone; preferiu ser chamado ao final da tarde.',
		authorName: 'Marta Silva',
		createdAt: daysAgo(1, 16, 30)
	}
];

function appt(
	id: string,
	dayOffset: number,
	hour: number,
	minute: number,
	durationMin: number,
	patient: string,
	doctor?: Doctor
): Appointment {
	const d = new Date();
	d.setDate(d.getDate() + dayOffset);
	d.setHours(hour, minute, 0, 0);
	return {
		id,
		startsAt: d.toISOString(),
		durationMin,
		patientName: patient,
		doctorId: doctor?.id,
		doctorName: doctor?.name,
		status: 'agendada'
	};
}

export const appointments: Appointment[] = [
	appt('a-1', 0, 9, 0, 30, 'Inês Ferreira', doctors[1]),
	appt('a-2', 0, 10, 0, 60, 'Carlos Neves', doctors[0]),
	appt('a-3', 0, 14, 30, 30, 'Luísa Ramos', doctors[2]),
	appt('a-4', 1, 9, 30, 45, 'Rita Gomes', doctors[0]),
	appt('a-5', -1, 16, 0, 30, 'Pedro Tavares', doctors[1])
];

export const users: User[] = [
	currentUser,
	{
		id: 'u-staff',
		name: 'Rui Santos',
		email: 'staff@cuidadente.pt',
		role: 'staff',
		active: true,
		createdAt: daysAgo(180)
	}
];

// ---------------------------------------------------------------------------
// Derived aggregates used by the dashboard.
// ---------------------------------------------------------------------------

export function leadStats() {
	const now = Date.now();
	const weekAgo = now - 7 * 86_400_000;
	const novos = leads.filter((l) => l.status === 'novo').length;
	const semana = leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length;
	const hoje = appointments.filter((a) => {
		const s = new Date(a.startsAt);
		const today = new Date();
		return (
			s.getFullYear() === today.getFullYear() &&
			s.getMonth() === today.getMonth() &&
			s.getDate() === today.getDate()
		);
	}).length;
	const conversao =
		leads.length === 0
			? 0
			: Math.round(
					(leads.filter((l) => l.status === 'marcado' || l.status === 'fechado').length / leads.length) * 100
				);
	return { novos, semana, hoje, conversao };
}

/** Appointments on a given local date (YYYY-MM-DD), oldest first. */
export function appointmentsForDate(dateStr: string): Appointment[] {
	return appointments
		.filter((a) => {
			const d = new Date(a.startsAt);
			return d.toISOString().slice(0, 10) === dateStr;
		})
		.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
