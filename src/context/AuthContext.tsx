import React, { createContext, useContext, useState } from 'react';
import { UserRole, AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  setQuickRole: (role: UserRole) => void;
}

const DEMO_USERS: Record<string, AdminUser> = {
  superadmin: {
    uid: 'super-admin-01',
    email: 'superadmin@thevoicelundasul.ao',
    nome: 'Director Geral do Evento',
    papel: 'Super Administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  admin: {
    uid: 'admin-01',
    email: 'admin@thevoicelundasul.ao',
    nome: 'Comissão de Organização',
    papel: 'Administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  juri: {
    uid: 'juri-01',
    email: 'juri@thevoicelundasul.ao',
    nome: 'Mestre Domingos Tchitombe (Júri)',
    papel: 'Júri',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  editor: {
    uid: 'editor-01',
    email: 'comunicacao@thevoicelundasul.ao',
    nome: 'Redactor & Imprensa',
    papel: 'Editor',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('tvls_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (email: string, pass: string): Promise<boolean> => {
    const lowerEmail = email.toLowerCase().trim();
    if (lowerEmail.includes('super')) {
      setUser(DEMO_USERS.superadmin);
      localStorage.setItem('tvls_auth_user', JSON.stringify(DEMO_USERS.superadmin));
      return true;
    } else if (lowerEmail.includes('juri') || lowerEmail.includes('jurado')) {
      setUser(DEMO_USERS.juri);
      localStorage.setItem('tvls_auth_user', JSON.stringify(DEMO_USERS.juri));
      return true;
    } else if (lowerEmail.includes('editor') || lowerEmail.includes('noticia')) {
      setUser(DEMO_USERS.editor);
      localStorage.setItem('tvls_auth_user', JSON.stringify(DEMO_USERS.editor));
      return true;
    } else if (lowerEmail.includes('admin') || pass.length >= 4) {
      setUser(DEMO_USERS.admin);
      localStorage.setItem('tvls_auth_user', JSON.stringify(DEMO_USERS.admin));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tvls_auth_user');
  };

  const setQuickRole = (newRole: UserRole) => {
    if (newRole === 'Visitante' || newRole === 'Candidato') {
      logout();
      return;
    }
    const key = newRole === 'Super Administrador' ? 'superadmin' :
                newRole === 'Júri' ? 'juri' :
                newRole === 'Editor' ? 'editor' : 'admin';
    const selected = DEMO_USERS[key];
    setUser(selected);
    localStorage.setItem('tvls_auth_user', JSON.stringify(selected));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.papel : 'Visitante',
        isAuthenticated: !!user,
        login,
        logout,
        setQuickRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
