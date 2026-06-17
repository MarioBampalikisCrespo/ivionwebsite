'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { UserDTO } from '../../../lib/types';
import { useAuth } from '../../../context/AuthContext';
import styles from '../auth.module.css';

const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE   = /^[^<>'";&|]{1,80}$/;

type Field = 'username' | 'userSurnames' | 'email' | 'password';

function validate(form: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (!form.username.trim())
    errors.username    = "El nombre es obligatorio";
  else if (!NAME_RE.test(form.username))
    errors.username    = "El nombre no puede contener caracteres especiales";

  if (form.userSurnames && !NAME_RE.test(form.userSurnames))
    errors.userSurnames = "Los apellidos no pueden contener caracteres especiales";

  if (!form.email.trim())
    errors.email       = "El email es obligatorio";
  else if (!EMAIL_RE.test(form.email))
    errors.email       = "Introduce un email válido (ej: usuario@dominio.com)";

  if (!form.password)
    errors.password    = "La contraseña es obligatoria";
  else if (form.password.length < 6)
    errors.password    = "La contraseña debe tener al menos 6 caracteres";

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<Record<Field, string>>({
    username: '', userSurnames: '', email: '', password: '',
  });
  const [touched,  setTouched]  = useState<Partial<Record<Field, boolean>>>({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

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
    setLoading(true);
    try {
      const user = await api.post<UserDTO>('/api/auth/register', form);
      login(user);
      router.push('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
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
      <div className={styles.card}>
        <h1 className={styles.title}>Crear Cuenta</h1>
        <p className={styles.subtitle}>Únete a iVion hoy mismo</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {field('username',     'Nombre',     'Mario')}
          {field('userSurnames', 'Apellidos',  'García López')}
          {field('email',        'Email',      'tu@email.com', 'email')}
          {field('password',     'Contraseña', '••••••••',     'password')}

          {apiError && <p className={styles.error}>{apiError}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
