"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  LogOut,
  Shield,
  Heart,
  Clock,
  Settings,
  Award,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavourites } from "@/contexts/FavouritesContext";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { favourites, getByType } = useFavourites();
  const { items } = useRecentlyViewed();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    { label: "Favourite Teams", value: getByType("team").length, icon: "⚽", color: "from-neon-green/20 to-transparent" },
    { label: "Favourite Players", value: getByType("player").length, icon: "👤", color: "from-neon-blue/20 to-transparent" },
    { label: "Favourite Leagues", value: getByType("league").length, icon: "🏆", color: "from-neon-purple/20 to-transparent" },
    { label: "Recently Viewed", value: items.length, icon: "👁️", color: "from-emerald-400/20 to-transparent" },
  ];

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="space-y-10 pb-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-neon-green/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-neon-blue flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-slate-900" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-neon-green" /> {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-neon-blue" /> Member since {memberSince}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/settings" className="btn-secondary p-2.5">
              <Settings className="w-5 h-5" />
            </Link>
            <button onClick={logout} className="btn-secondary p-2.5 border-red-400/30 hover:border-red-400/60 text-red-400">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card text-center py-5 bg-gradient-to-b ${stat.color}`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-bold gradient-text mt-2">
              <AnimatedCounter value={stat.value} />
            </p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/matches" className="glass-card p-6 group hover:border-neon-green/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-neon-green/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-neon-green" />
            </div>
            <div>
              <h3 className="font-bold group-hover:text-neon-green transition-colors">Live Matches</h3>
              <p className="text-xs text-slate-400">Follow action in real-time</p>
            </div>
          </div>
        </Link>

        <Link href="/favourites" className="glass-card p-6 group hover:border-red-400/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-bold group-hover:text-red-400 transition-colors">Favourites</h3>
              <p className="text-xs text-slate-400">{favourites.length} saved items</p>
            </div>
          </div>
        </Link>

        <Link href="/leagues" className="glass-card p-6 group hover:border-neon-blue/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h3 className="font-bold group-hover:text-neon-blue transition-colors">League Standings</h3>
              <p className="text-xs text-slate-400">Tables and statistics</p>
            </div>
          </div>
        </Link>

        <Link href="/profile" className="glass-card p-6 group hover:border-neon-purple/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-neon-purple" />
            </div>
            <div>
              <h3 className="font-bold group-hover:text-neon-purple transition-colors">Activity</h3>
              <p className="text-xs text-slate-400">Recently viewed items</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
