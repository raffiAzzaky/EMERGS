/**
 * pages/user/Notifications.jsx
 *
 * Displays user notifications with mark-as-read and dismiss actions.
 * Composes: PageHeader, NotificationItem, Button, EmptyState.
 */

import { useState, useCallback, useEffect } from "react";
import {
  Bell, CheckCircle,
  Info, ClipboardList, AlertTriangle, Users, Zap,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getNotifications, markNotificationRead, deleteNotification, markAllNotificationsRead } from "../../services/api";

import PageHeader        from "../../components/common/PageHeader";
import NotificationItem  from "../../components/user/NotificationItem";
import Button            from "../../components/common/Button";
import EmptyState        from "../../components/common/EmptyState";
import { NOTIF_META } from "../../data/notifications";

// Map iconName string → lucide component
const ICON_MAP = { Info, ClipboardList, AlertTriangle, Users, Zap };

// Resolve icon component into meta object
function resolveMeta(type) {
  const raw  = NOTIF_META[type] ?? NOTIF_META.info;
  const Icon = ICON_MAP[raw.iconName];
  return { ...raw, icon: Icon };
}

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
};

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authFetch } = useAuth();

  const fetchNotifs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getNotifications(authFetch);
      setNotifs(data.map(n => ({
        id: n._id,
        title: n.title,
        body: n.message,
        time: timeAgo(n.timestamp),
        type: n.type,
        read: n.status === 'read'
      })));
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchNotifs();
  }, [fetchNotifs]);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markRead = useCallback(
    async (id) => {
      try {
        await markNotificationRead(authFetch, id);
        setNotifs((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)));
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
    },
    [authFetch]
  );

  const dismiss = useCallback(
    async (id) => {
      try {
        await deleteNotification(authFetch, id);
        setNotifs((ns) => ns.filter((n) => n.id !== id));
      } catch (err) {
        console.error("Failed to delete notification:", err);
      }
    },
    [authFetch]
  );

  const markAll = useCallback(
    async () => {
      try {
        await markAllNotificationsRead(authFetch);
        setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark all read:", err);
      }
    },
    [authFetch]
  );

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-8 lg:py-10">
      {/* ── Page header ── */}
      <PageHeader
        title="Notifikasi"
        subtitle={unreadCount > 0 ? `${unreadCount} belum dibaca` : "Semua sudah dibaca"}
        actions={
          unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<CheckCircle className="w-3.5 h-3.5" />}
              onClick={markAll}
            >
              Tandai semua dibaca
            </Button>
          )
        }
      />

      {/* ── Notification list ── */}
      {loading ? (
        <div className="p-8 text-center text-text/60">Memuat notifikasi...</div>
      ) : notifs.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-accent" />}
          title="Tidak ada notifikasi"
          message="Semua notifikasi sudah dibaca atau dihapus."
        />
      ) : (
        <div className="bg-white border border-accent/20 rounded-2xl overflow-hidden shadow-sm">
          {notifs.map((notif, i) => (
            <NotificationItem
              key={notif.id}
              notif={notif}
              meta={resolveMeta(notif.type)}
              onRead={markRead}
              onDismiss={dismiss}
              isLast={i === notifs.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
