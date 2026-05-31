import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, X, ArrowRight, Activity, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationsStore } from '../../lib/store/useNotificationsStore';
import { designSystem } from '../../lib/design-system';
import { useNavigate } from 'react-router-dom';

export const NotificationsTray: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsStore();
  const { colors, typography, shadows } = designSystem;
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <Info size={16} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'alert': return <Activity size={16} className="text-red-500" />;
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return <Bell size={16} className="text-slate-500" />;
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const diffDays = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (diffDays === 0) {
       const diffHours = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 3600));
       if (diffHours === 0) {
         const diffMins = Math.round((new Date(dateStr).getTime() - new Date().getTime()) / 1000 / 60);
         return rtf.format(diffMins, 'minute');
       }
       return rtf.format(diffHours, 'hour');
    }
    return rtf.format(diffDays, 'day');
  };

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors relative"
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 lg:w-96 bg-white rounded-2xl border border-slate-200 overflow-hidden z-50"
            style={{ boxShadow: shadows.e3 }}
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800" style={{ fontFamily: typography.fonts.interface }}>Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Check size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-b border-slate-50 flex gap-3 transition-colors ${!notif.read ? 'bg-indigo-50/30' : 'hover:bg-slate-50'}`}
                    onClick={() => { if (!notif.read) markAsRead(notif.id); }}
                  >
                    <div className="mt-1">
                      {getIcon(notif.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{notif.source}</span>
                        <span className="text-xs text-slate-400">{getRelativeTime(notif.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-800 mb-2 leading-snug">{notif.message}</p>
                      {notif.cta && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                            navigate(notif.cta!.action);
                            setIsOpen(false);
                          }}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-2"
                        >
                          {notif.cta.label} <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
              <span className="text-xs text-slate-400 font-medium">// TODO: Implement webhook & cron triggers</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
