'use client';

import Link from 'next/link';
import { CiChat1 } from 'react-icons/ci';
import { useAuth } from '../context/AuthContext';
import styles from './adminChatFab.module.css';

// Admin-only, shown on every page (mounted once in the root layout) — a
// shortcut into the internal admin chat regardless of where you're browsing.
export default function AdminChatFab() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <Link href="/account/admin/chat" className={styles.fab} title="Chat de administradores">
      <CiChat1 className={styles.icon} />
    </Link>
  );
}
