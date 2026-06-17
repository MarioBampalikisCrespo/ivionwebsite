'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { UserDTO } from '../../../lib/types';
import { useAuth } from '../../../context/AuthContext';
import styles from '../auth.module.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string) {
  const errors: { email?: string; password?: string } = {};
  if (!email.trim())              errors.email    = "El email es obligatorio";
  else if (!EMAIL_RE.test(email)) errors.email    = "Introduce un email válido (ej: usuario@dominio.com)";
  if (!password)                  errors.password = "La contraseña es obligatoria";
  else if (password.length < 6)   errors.password = "La contraseña debe tener al menos 6 caracteres";
  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [touched,  setTouched]  = useState<{ email?: boolean; password?: boolean }>({});
  const [apiError, setApiError] = useState('');
  const [loading,  setLoading]  = useState(false);

  const errors = validate(email, password);

  const handleBlur = (field: 'email' | 'password') =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (Object.keys(errors).length > 0) return;
    setApiError('');
    setLoading(true);
    try {
      const user = await api.post<UserDTO>('/api/auth/login', { email, password });
      login(user);
      router.push('/');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <p className={styles.subtitle}>Accede a tu cuenta iVion</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`${styles.input}${touched.email && errors.email ? ` ${styles.inputError}` : ''}`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="tu@email.com"
              autoComplete="email"
            />
            {touched.email && errors.email && (
              <div className={styles.fieldError}>{errors.email}</div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className={`${styles.input}${touched.password && errors.password ? ` ${styles.inputError}` : ''}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {touched.password && errors.password && (
              <div className={styles.fieldError}>{errors.password}</div>
            )}
          </div>

          {apiError && <p className={styles.error}>{apiError}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className={styles.footer}>
          ¿No tienes cuenta?{' '}
          <Link href="/auth/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
