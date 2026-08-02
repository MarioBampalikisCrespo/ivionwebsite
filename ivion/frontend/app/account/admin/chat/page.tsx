'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../../lib/api';
import { ChatMessageDTO } from '../../../../lib/types';
import { useAdminGuard } from '../../../../hooks/useAdminGuard';
import styles from './adminChat.module.css';

export default function AdminChatPage() {
  const { ready, user } = useAdminGuard();
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const loadMessages = () => {
      api.get<ChatMessageDTO[]>('/api/admin/chat/messages')
        .then(data => { if (!cancelled) setMessages(data); })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false); });
    };
    loadMessages();
    const interval = setInterval(loadMessages, 4000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [ready]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  if (!ready) return null;

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setSending(true);
    setError('');
    try {
      const message = await api.post<ChatMessageDTO>('/api/admin/chat/messages', { content });
      setMessages(prev => [...prev, message]);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.page}>
      <Link href="/account" className={styles.backLink}>← Volver al perfil</Link>

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Chat de administradores</h1>
      </div>

      <div className={styles.chatBox}>
        <div className={styles.messages} ref={messagesRef}>
          {loading && <p className={styles.empty}>Cargando mensajes...</p>}
          {!loading && messages.length === 0 && (
            <p className={styles.empty}>Todavía no hay mensajes. Escribe el primero.</p>
          )}
          {messages.map(msg => {
            if (msg.system) {
              return (
                <div key={msg.id} className={styles.systemLine}>{msg.content}</div>
              );
            }
            const isOwn = msg.senderName === user?.username;
            return (
              <div key={msg.id} className={`${styles.messageRow} ${isOwn ? styles.own : ''}`}>
                <span className={styles.meta}>{msg.senderName} · {formatTime(msg.createdAt)}</span>
                <div className={styles.bubble}>{msg.content}</div>
              </div>
            );
          })}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form className={styles.inputRow} onSubmit={handleSend}>
          <input
            className={styles.input}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Escribe un mensaje..."
            maxLength={2000}
          />
          <button type="submit" className={styles.sendBtn} disabled={sending || !text.trim()}>
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
