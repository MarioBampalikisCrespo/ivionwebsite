'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { UserDTO } from '../../../../lib/types';
import { useAdminGuard } from '../../../../hooks/useAdminGuard';
import styles from './adminUsers.module.css';

export default function AdminUsersPage() {
  const { ready } = useAdminGuard();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;
    api.get<UserDTO[]>('/api/users')
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [ready]);

  if (!ready) return null;

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    setError('');
    try {
      await api.delete(`/api/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el usuario');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <Link href="/account" className={styles.backLink}>← Volver al perfil</Link>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Gestionar usuarios</h1>
        <Link href="/account/admin/users/new" className={styles.newBtn}>
          Nuevo usuario
        </Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && <p className={styles.loading}>Cargando usuarios...</p>}

      {!loading && users.length === 0 && (
        <p className={styles.empty}>No hay usuarios todavía.</p>
      )}

      {!loading && users.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username} {user.userSurnames}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${user.role === 'ADMIN' ? styles.admin : ''}`}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={`/account/admin/users/${user.id}/edit`} className={styles.editLink}>
                        Editar
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(user.id)}
                        disabled={deletingId === user.id}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
