"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Calendar, Users, Settings, Menu, X, LogOut } from "lucide-react";
import { logout } from "@/app/actions";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Agenda", icon: Calendar },
    { href: "/participantes", label: "Participantes", icon: Users },
    { href: "/configuracoes", label: "Ajustes", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md print:hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Car className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Caronas
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-8 w-8 rounded-full bg-blue-100 items-center justify-center text-blue-700 font-bold text-xs">
            YC
          </div>
          
          <form action={logout} className="hidden md:block">
            <button 
              type="submit" 
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </form>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all font-semibold"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <form action={logout} className="w-full">
              <button 
                type="submit"
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold text-left"
              >
                <LogOut className="h-5 w-5" />
                Sair
              </button>
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}
