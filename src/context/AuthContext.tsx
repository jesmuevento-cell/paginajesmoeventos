import React, { createContext, useContext, useState } from 'react';
import { UserRole, AdminUser } from '../types';

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  desc: string;
  avatarUrl: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'superadmin@thevoicelundasul.ao',
    password: 'admin',
    role: 'Super Administrador',
    name: 'Director Geral do Evento',
    desc: 'Acesso total: Configurações, Jurados, Candidatos, Etapas e Notícias',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    email: 'admin@thevoicelundasul.ao',
    password: 'admin',
    role: 'Administrador',
    name: 'Comissão Organizadora',
    desc: 'Gestão de Candidaturas, Aprovações, Exportação CSV e Etapas',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    email: 'juri@thevoicelundasul.ao',
    password: 'admin',
    role: 'Júri',
    name: 'Mestre Domingos Tchitombe (Júri)',
    desc: 'Avaliação técnica com notas de 0 a 10 nos 6 critérios oficiais',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    email: 'comunicacao@thevoicelundasul.ao',
    password: 'admin',
    role: 'Editor',
    name: 'Redactor & Imprensa',
    desc: 'Publicação de notícias, comunicados e comunicados de imprensa',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];

interface AuthContextType {
  user: AdminUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  demoUsers: DemoAccount[];
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  setQuickRole: (role: UserRole) => void;
}

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

  const login = async (emailInput: string, passInput: string): Promise<boolean> => {
    const lower = emailInput.toLowerCase().trim();
    
    // Check if matched demo accounts or generic passwords
    const matchedDemo = DEMO_ACCOUNTS.find(
      (d) => d.email.toLowerCase() === lower || (lower.includes('super') && d.role === 'Super Administrador')
    );

    if (matchedDemo) {
      const adminUser: AdminUser = {
        uid: `uid-${matchedDemo.role.toLowerCase().replace(/\s+/g, '-')}`,
        email: matchedDemo.email,
        nome: matchedDemo.name,
        papel: matchedDemo.role,
        avatarUrl: matchedDemo.avatarUrl,
      };
      setUser(adminUser);
      localStorage.setItem('tvls_auth_user', JSON.stringify(adminUser));
      return true;
    }

    if (lower.includes('juri') || lower.includes('jurado')) {
      const d = DEMO_ACCOUNTS[2];
      const adminUser: AdminUser = { uid: 'uid-juri', email: d.email, nome: d.name, papel: 'Júri', avatarUrl: d.avatarUrl };
      setUser(adminUser);
      localStorage.setItem('tvls_auth_user', JSON.stringify(adminUser));
      return true;
    }

    if (lower.includes('editor') || lower.includes('imprensa') || lower.includes('noticia')) {
      const d = DEMO_ACCOUNTS[3];
      const adminUser: AdminUser = { uid: 'uid-editor', email: d.email, nome: d.name, papel: 'Editor', avatarUrl: d.avatarUrl };
      setUser(adminUser);
      localStorage.setItem('tvls_auth_user', JSON.stringify(adminUser));
      return true;
    }

    // Default admin fallback if valid pass or email
    if (lower.length > 3 && passInput.length >= 3) {
      const adminUser: AdminUser = {
        uid: `uid-custom-${Date.now()}`,
        email: emailInput,
        nome: emailInput.split('@')[0].toUpperCase(),
        papel: 'Administrador',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      };
      setUser(adminUser);
      localStorage.setItem('tvls_auth_user', JSON.stringify(adminUser));
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
    const matched = DEMO_ACCOUNTS.find((d) => d.role === newRole) || DEMO_ACCOUNTS[1];
    const adminUser: AdminUser = {
      uid: `uid-${matched.role.toLowerCase().replace(/\s+/g, '-')}`,
      email: matched.email,
      nome: matched.name,
      papel: matched.role,
      avatarUrl: matched.avatarUrl,
    };
    setUser(adminUser);
    localStorage.setItem('tvls_auth_user', JSON.stringify(adminUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.papel : 'Visitante',
        isAuthenticated: !!user,
        demoUsers: DEMO_ACCOUNTS,
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
