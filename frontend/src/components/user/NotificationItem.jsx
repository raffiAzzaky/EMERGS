/**
 * components/user/NotificationItem.jsx
 *
 * A single notification row inside the notifications list.
 *
 * Props:
 *  - notif    : { id, title, body, time, type, read }
 *  - meta     : { bg, text, dot, icon } — from NOTIF_META
 *  - onRead   : (id) => void
 *  - onDismiss: (id) => void
 *  - isLast   : boolean — omit bottom border on last item
 */

import { X } from "lucide-react";

export default function NotificationItem({
  notif,
  meta,
  onRead,
  onDismiss,
  isLast = false,
}) {
  const { id, title, body, time, read } = notif;
  const Icon = meta?.icon;

  return (
    <div
      onClick={() => onRead?.(id)}
      className={`
        flex items-start gap-4 px-5 py-4 cursor-pointer group
        transition-all duration-200 hover:bg-accent/10
        ${!isLast ? "border-b border-accent/15" : ""}
        ${!read ? "bg-accent/5" : ""}
      `}
    >
      {/* Type icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta?.bg} shadow-sm`}>
        {Icon && <Icon className={`w-5 h-5 ${meta?.text}`} />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className={`text-sm ${read ? "text-text/70 font-medium" : "text-text font-bold"}`}>
            {title}
          </p>
          {!read && (
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${meta?.dot}`} />
          )}
        </div>
        <p className="text-text/65 text-xs leading-relaxed">{body}</p>
        <p className="text-text/55 text-[10px] mt-1.5 font-medium">{time}</p>
      </div>

      {/* Dismiss button (visible on hover) */}
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss?.(id); }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-accent/20 text-text/50 hover:text-text transition-all duration-200 flex-shrink-0"
        aria-label="Hapus notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
