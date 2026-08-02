'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../../../lib/api';
import { UserDTO, RegisterRequest } from '../../../../../lib/types';
import { useAdminGuard } from '../../../../../hooks/useAdminGuard';
import styles from '../adminUsers.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE  = /^[^<>'";&|]{1,80}$/;

type Field = 'username' | 'userSurnames' | 'email' | 'password';

function validate(form: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!form.username.trim())
    errors.username = 'El nombre es obligatorio';
  else if (!NAME_RE.test(form.username))
    errors.username = 'El nombre no puede contener caracteres especiales';

  if (form.userSurnames && !NAME_RE.test(form.userSurnames))
    errors.userSurnames = 'Los apellidos no pueden contener caracteres especiales';

  if (!form.email.trim())
    errors.email = 'El email es obligatorio';
  else if (!EMAIL_RE.test(form.email))
    errors.email = 'Introduce un email válido (ej: usuario@dominio.com)';

  if (!form.password)
    errors.password = 'La contraseña es obligatoria';
  else if (form.password.length < 6)
    errors.password = 'La contraseña debe tener al menos 6 caracteres';

  return errors;
}

export default function NewUserPage() {
  const router = useRouter();
  const { ready } = useAdminGuard();

  const [form, setForm] = useState<Record<Field, string>>({
    username: '', userSurnames: '', email: '', password: '',
  });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!ready) return null;

  const errors = validate(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleBlur = (field: Field) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, userSurnames: true, email: true, password: true });
    if (Object.keys(errors).length > 0) return;

    setApiError('');
    setSaving(true);
    try {
      const body: RegisterRequest = { ...form };
      await api.post<UserDTO>('/api/users', body);
      router.push('/account/admin/users');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al crear el usuario');
    } finally {
      setSaving(false);
    }
  };

  const field = (id: Field, label: string, placeholder: string, type = 'text') => (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        className={`${styles.input}${touched[id] && errors[id] ? ` ${styles.inputError}` : ''}`}
        value={form[id]}
        onChange={handleChange}
        onBlur={() => handleBlur(id)}
        placeholder={placeholder}
        autoComplete={id === 'password' ? 'new-password' : id === 'email' ? 'email' : 'off'}
      />
      {touched[id] && errors[id] && (
        <div className={styles.fieldError}>{errors[id]}</div>
      )}
    </div>
  );

  return (
    <div className={styles.page}>
      <Link href="/account/admin/users" className={styles.backLink}>← Volver al listado</Link>
      <h1 className={styles.title} style={{ marginTop: 12, marginBottom: 24 }}>Nuevo usuario</h1>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {field('username', 'Nombre', 'Mario')}
          {field('userSurnames', 'Apellidos', 'García López')}
          {field('email', 'Email', 'usuario@email.com', 'email')}
          {field('password', 'Contraseña', '••••••••', 'password')}

          {apiError && <p className={styles.error}>{apiError}</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={saving}>
              {saving ? 'Creando...' : 'Crear usuario'}
            </button>
            <Link href="/account/admin/users" className={styles.cancel}>Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
