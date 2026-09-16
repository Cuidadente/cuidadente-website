<script lang="ts">
  import { Alert, Badge, Button, Card, DataTable, Select, TextInput } from '$lib/ui';
  import { ROLES, type Role } from '$lib/constants';
  import { users, currentUser, type User } from '$lib/data';
  import { createUser, setUserActive, ApiError } from '$lib/api';

  let usersList = $state<User[]>(users.map((u) => ({ ...u })));
  let me = currentUser;
  let notice = $state('');
  let noticeTone = $state<'success' | 'error'>('success');
  let submitting = $state<Record<string, boolean>>({});

  // Create-account form state.
  let name = $state('');
  let email = $state('');
  let password = $state('');
  let role = $state<Role>('staff');
  let formErrors = $state<Record<string, string>>({});
  let formValues = $state<Record<string, string>>({});

  const roleOptions = Object.entries(ROLES).map(([value, r]) => ({ value, label: r.label }));
  const date = (iso: string) =>
    new Date(iso + 'Z').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  async function onCreate(e: SubmitEvent) {
    e.preventDefault();
    notice = '';
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Indique o nome.';
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'Indique um email válido.';
    if (password.length < 10) errors.password = 'A palavra-passe precisa de pelo menos 10 caracteres.';
    if (!(role in ROLES)) errors.role = 'Perfil inválido.';
    if (usersList.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      errors.email = 'Já existe uma conta com esse email.';
    }
    formErrors = errors;
    formValues = { name, email, password, role };
    if (Object.keys(errors).length > 0) return;

    submitting = { ...submitting, create: true };
    try {
      const result = await createUser({ name: name.trim(), email: email.trim(), password, role });
      usersList = [
        {
          id: `u-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
          active: true,
          createdAt: new Date().toISOString()
        },
        ...usersList
      ];
      notice = result.ok ? 'Conta criada.' : 'Conta criada.';
      noticeTone = 'success';
      name = '';
      email = '';
      password = '';
      role = 'staff';
      formErrors = {};
      formValues = {};
    } catch (err) {
      if (err instanceof ApiError) {
        formErrors = err.fieldErrors;
        notice = err.fieldErrors._form ?? err.message;
        noticeTone = 'error';
      } else {
        notice = 'Ocorreu um erro. Tente novamente.';
        noticeTone = 'error';
      }
    } finally {
      submitting = { ...submitting, create: false };
    }
  }

  async function onToggle(id: string, active: boolean) {
    if (submitting[id]) return;
    submitting = { ...submitting, [id]: true };
    const target = usersList.find((u) => u.id === id);
    try {
      await setUserActive(id, active);
      usersList = usersList.map((u) => (u.id === id ? { ...u, active } : u));
      notice = target ? `Conta de ${target.name} ${active ? 'ativada' : 'desativada'}.` : 'Estado atualizado.';
      noticeTone = 'success';
    } catch (err) {
      notice = err instanceof ApiError ? err.message : 'Ocorreu um erro. Tente novamente.';
      noticeTone = 'error';
    } finally {
      submitting = { ...submitting, [id]: false };
    }
  }
</script>

<svelte:head><title>Utilizadores — Gestão CuidaDente</title></svelte:head>

<header class="mb-6">
  <p class="eyebrow">Administração</p>
  <h1 class="font-display text-3xl font-semibold text-base-content">Utilizadores</h1>
</header>

{#if notice}
  <div class="mb-5"><Alert tone={noticeTone}>{notice}</Alert></div>
{/if}

<div class="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
  <Card title="Contas ativas">
    <DataTable columns={['Nome', 'Email', 'Perfil', 'Criada', '']} isEmpty={usersList.length === 0}>
      {#snippet rows()}
        {#each usersList as u (u.id)}
          <tr class={u.active ? '' : 'opacity-50'}>
            <td class="font-semibold">{u.name}</td>
            <td class="text-sm">{u.email}</td>
            <td><Badge tone={u.role === 'admin' ? 'accent' : 'neutral'}>{ROLES[u.role].label}</Badge></td>
            <td class="text-sm tabular-nums text-base-content/60">{date(u.createdAt)}</td>
            <td class="text-right">
              {#if u.id !== me.id}
                <button
                  type="button"
                  onclick={() => onToggle(u.id, !u.active)}
                  class="link link-hover text-sm {u.active ? 'text-error' : 'text-teal-600'}"
                >
                  {u.active ? 'Desativar' : 'Reativar'}
                </button>
              {:else}
                <span class="text-xs text-base-content/40">a sua conta</span>
              {/if}
            </td>
          </tr>
        {/each}
      {/snippet}
    </DataTable>
  </Card>

  <Card title="Criar conta" variant="alt">
    <form onsubmit={onCreate} class="grid gap-4">
      <TextInput label="Nome" name="name" required bind:value={name} error={formErrors.name} />
      <TextInput label="Email" name="email" type="email" required bind:value={email} error={formErrors.email} />
      <TextInput label="Palavra-passe provisória" name="password" type="password" required hint="Mínimo 10 caracteres." bind:value={password} error={formErrors.password} />
      <Select label="Perfil" name="role" bind:value={role} options={roleOptions} error={formErrors.role} />
      <div><Button type="submit" variant="secondary" loading={submitting.create}>Criar conta</Button></div>
    </form>
  </Card>
</div>
