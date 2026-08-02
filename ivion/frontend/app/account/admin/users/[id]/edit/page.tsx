'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../../../lib/api';
import { UserDTO, UserUpdateRequest } from '../../../../../../lib/types';
import { useAdminGuard } from '../../../../../../hooks/useAdminGuard';
import styles from '../../adminUsers.module.css';

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

  if (form.password && form.password.length < 6)
    errors.password = 'La contraseña debe tener al menos 6 caracteres';

  return errors;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { ready } = useAdminGuard();

  const [form, setForm] = useState<Record<Field, string>>({
    username: '', userSurnames: '', email: '', password: '',
  });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ready) return;
    api.get<UserDTO>(`/api/users/${params.id}`)
      .then(user => {
        setForm({
          username: user.username,
          userSurnames: user.userSurnames ?? '',
          email: user.email,
          password: '',
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [ready, params.id]);

  if (!ready) return null;
  if (loading) return <div className={styles.page}><p className={styles.loading}>Cargando usuario...</p></div>;
  if (notFound) return <div className={styles.page}><p className={styles.error}>Usuario no encontrado.</p></div>;

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
      const body: UserUpdateRequest = {
        username: form.username,
        userSurnames: form.userSurnames,
        email: form.email,
        password: form.password.trim() ? form.password : null,
      };
      await api.put<UserDTO>(`/api/users/${params.id}`, body);
      router.push('/account/admin/users');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al guardar los cambios');
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
      <h1 className={styles.title} style={{ marginTop: 12, marginBottom: 24 }}>Editar usuario</h1>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {field('username', 'Nombre', 'Mario')}
          {field('userSurnames', 'Apellidos', 'García López')}
          {field('email', 'Email', 'usuario@email.com', 'email')}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Nueva contraseña (opcional)</label>
            <input
              id="password" name="password" type="password"
              className={`${styles.input}${touched.password && errors.password ? ` ${styles.inputError}` : ''}`}
              value={form.password} onChange={handleChange} onBlur={() => handleBlur('password')}
              placeholder="••••••••" autoComplete="new-password"
            />
            <span className={styles.hint}>Déjalo en blanco para no cambiar la contraseña actual.</span>
            {touched.password && errors.password && <div className={styles.fieldError}>{errors.password}</div>}
          </div>

          {apiError && <p className={styles.error}>{apiError}</p>}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
            <Link href="/account/admin/users" className={styles.cancel}>Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
