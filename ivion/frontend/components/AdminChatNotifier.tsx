'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';
import { ChatMessageDTO } from '../lib/types';
import { useAuth } from '../context/AuthContext';
import styles from './adminChatNotifier.module.css';

interface ToastItem {
  key: number;
  senderName: string;
  content: string;
}

function NotifierToast({ item, onClose, onClick }: {
  item: ToastItem;
  onClose: () => void;
  onClick: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast} onClick={onClick}>
      <span className={styles.sender}>{item.senderName}</span>
      <span className={styles.content}>{item.content}</span>
    </div>
  );
}

// Global, page-agnostic: polls the admin chat and pops a toast for messages
// (human or system activity logs) posted by someone else, wherever the admin
// is currently browsing. Separate from components/Toast.tsx, which is built
// for a single self-triggered notification (add to cart), not a stack of
// asynchronous notifications from other people.
export default function AdminChatNotifier() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const lastSeenId = useRef<number | null>(null);

  const isAdmin = isAuthenticated && user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    const poll = () => {
      api.get<ChatMessageDTO[]>('/api/admin/chat/messages')
        .then(messages => {
          if (cancelled || messages.length === 0) return;
          const maxId = Math.max(...messages.map(m => m.id));

          if (lastSeenId.current === null) {
            // First fetch just sets the baseline — no toast storm for old history.
            lastSeenId.current = maxId;
            return;
          }

          const baseline = lastSeenId.current;
          // Activity logs always toast (even your own actions), but regular
          // chat messages only toast when someone else wrote them.
          const newOnes = messages.filter(m => m.id > baseline && (m.system || m.senderName !== user?.username));
          if (newOnes.length > 0) {
            setToasts(prev => [
              ...prev,
              ...newOnes.map(m => ({ key: m.id, senderName: m.senderName, content: m.content })),
            ]);
          }
          lastSeenId.current = maxId;
        })
        .catch(() => {});
    };

    poll();
    const interval = setInterval(poll, 4000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [isAdmin, user?.username]);

  const dismiss = (key: number) => setToasts(prev => prev.filter(t => t.key !== key));

  if (!isAdmin || toasts.length === 0) return null;

  return (
    <div className={styles.stack}>
      {toasts.map(t => (
        <NotifierToast
          key={t.key}
          item={t}
          onClose={() => dismiss(t.key)}
          onClick={() => { dismiss(t.key); router.push('/account/admin/chat'); }}
        />
      ))}
    </div>
  );
}
