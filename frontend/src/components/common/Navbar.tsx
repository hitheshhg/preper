'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  User,
  Shield,
  LogOut,
  Bell,
  ChevronDown
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { logoutAction, getCurrentUser } from '@/app/actions/auth';
import { SessionUser } from '@/lib/auth/session';

interface NavbarProps {
  user?: SessionUser | null;
  userName?: string;
  streak?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  userName,
  streak = 0
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<SessionUser | null>(user || null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/interview', label: 'Practice' },
    { href: '/resume', label: 'Resume' },
    { href: '/analytics', label: 'Progress' },
    { href: '/profile', label: 'Profile' },
  ];

  useEffect(() => {
    if (user) {
      setActiveUser(user);
      return;
    }
    getCurrentUser()
      .then(u => {
        if (u) setActiveUser(u);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await logoutAction();
    setActiveUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border transition-colors select-none">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 h-18 flex items-center justify-between">
        {/* Left: Typographic Wordmark PREPR */}
        <div className="flex items-center gap-6">
          <Link href={activeUser ? '/dashboard' : '/'} className="group flex items-center gap-3">
            <span className="font-serif text-xl tracking-[0.22em] font-normal text-foreground transition-opacity group-hover:opacity-75 uppercase">
              PREPR
            </span>
          </Link>
          <span className="hidden md:inline-block text-[10px] uppercase tracking-[0.16em] text-foreground-muted font-mono">
            Studio
          </span>
        </div>

        {/* Center: Primary Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-sans font-medium uppercase tracking-[0.14em]">
          {navLinks.map(link => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 relative ${
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-foreground-secondary hover:text-foreground'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[1.5px] bg-foreground" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Streak, Theme Toggle, Notifications, User Menu */}
        <div className="flex items-center gap-4">
          {/* Streak Badge (rendered only if user has active streak) */}
          {streak > 0 && (
            <div
              className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-[0.14em] font-medium text-foreground-secondary px-3 py-1 rounded-full border border-border"
              title="Daily Active Streak"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lavender" />
              <span>{streak} Day Streak</span>
            </div>
          )}

          {/* Theme Switcher Segmented Control */}
          <ThemeToggle />

          {/* User Profile Dropdown or Sign In */}
          {activeUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-xs font-sans text-foreground-secondary hover:text-foreground transition-colors p-1.5 rounded-full border border-border hover:border-border-strong cursor-pointer"
                aria-expanded={userMenuOpen}
                aria-label="User profile menu"
              >
                <div className="w-6 h-6 rounded-full bg-surface-muted flex items-center justify-center text-[10px] font-medium text-foreground">
                  {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline-block text-[11px] font-medium max-w-[100px] truncate">
                  {activeUser.name || activeUser.email.split('@')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-foreground-muted" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-2xl shadow-lg p-2 text-xs z-50 space-y-1">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-serif text-sm font-normal text-foreground truncate">{activeUser.name || 'Candidate'}</p>
                    <p className="text-[10px] font-mono text-foreground-muted truncate">{activeUser.email}</p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-surface-muted transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-foreground-muted" />
                    <span>Candidate Profile</span>
                  </Link>

                  {activeUser.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-foreground hover:bg-surface-muted transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5 text-lavender" />
                      <span>Admin Management</span>
                    </Link>
                  )}

                  <div className="pt-1 border-t border-border">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-pink hover:bg-pink-soft/15 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs uppercase tracking-wider text-foreground-secondary hover:text-foreground font-sans transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-pill-primary text-[10px] py-2 px-4"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-xs font-sans uppercase tracking-[0.14em]">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2 transition-colors ${
                    isActive ? 'text-foreground font-semibold' : 'text-foreground-secondary hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {activeUser?.role === 'ADMIN' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-lavender font-medium"
              >
                Admin Portal
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            {activeUser ? (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="text-xs uppercase tracking-wider text-pink flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-wider text-foreground-secondary hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-pill-primary text-[10px] py-2 px-4"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
