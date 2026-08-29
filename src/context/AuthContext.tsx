import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, AdminUser, AppUser } from '../types';
import { fetchUsers, saveUser, findUserByEmail, deleteUser as deleteUserService } from '../firebase/services';

export interface DemoAccount {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  desc: string;
  avatarUrl: string;
  masterPin?: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    email: 'superadmin@thevoicelundasul.ao',
    password: 'admin',
    masterPin: 'super2026',
    role: 'Super Administrador',
    name: 'Director Geral do Evento',
    desc: 'Acesso total: Configurações, Jurados, Candidatos, Etapas e Notícias',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    email: 'admin@thevoicelundasul.ao',
    password: 'admin',
    masterPin: 'admin2026',
    role: 'Administrador',
    name: 'Comissão Organizadora',
    desc: 'Gestão de Candidaturas, Aprovações, Exportação CSV e Etapas',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    email: 'juri@thevoicelundasul.ao',
    password: 'admin',
    masterPin: 'juri2026',
    role: 'Júri',
    name: 'Mestre Domingos Tchitombe (Júri)',
    desc: 'Avaliação técnica com notas de 0 a 10 nos 6 critérios oficiais',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    email: 'comunicacao@thevoicelundasul.ao',
    password: 'admin',
    masterPin: 'imprensa2026',
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
  registeredUsers: AppUser[];
  login: (email: string, pass?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithPasswordOnly: (password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithEmailOnly: (email: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (userData: {
    nome: string;
    email: string;
    password: string;
    papel: UserRole;
    telefone?: string;
    municipio?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  removeUser: (uid: string) => Promise<void>;
  logout: () => void;
  setQuickRole: (role: UserRole) => void;
  refreshUsers: () => Promise<void>;
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

  const [registeredUsers, setRegisteredUsers] = useState<AppUser[]>([]);

  const loadRegisteredUsers = async () => {
    try {
      const list = await fetchUsers();
      setRegisteredUsers(list);
    } catch (e) {
      console.warn('Erro ao carregar utilizadores registados:', e);
    }
  };

  useEffect(() => {
    loadRegisteredUsers();
  }, []);

  const setUserSession = (adminUser: AdminUser) => {
    setUser(adminUser);
    localStorage.setItem('tvls_auth_user', JSON.stringify(adminUser));
  };

  // Cadastrar Novo Utilizador no Sistema
  const registerUser = async (userData: {
    nome: string;
    email: string;
    password: string;
    papel: UserRole;
    telefone?: string;
    municipio?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanName = userData.nome.trim();

    if (!cleanName || cleanName.length < 2) {
      return { success: false, message: 'Por favor, insira o seu nome completo.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Por favor, insira um email válido.' };
    }
    if (!userData.password || userData.password.length < 4) {
      return { success: false, message: 'A palavra-passe deve conter pelo menos 4 caracteres.' };
    }

    // Verificar se o email já existe nas contas demo
    const existingDemo = DEMO_ACCOUNTS.find((d) => d.email.toLowerCase() === cleanEmail);
    if (existingDemo) {
      return { success: false, message: 'Este email já está registado como conta do sistema.' };
    }

    // Verificar se já existe na base de dados
    const existingUser = await findUserByEmail(cleanEmail);
    if (existingUser) {
      return { success: false, message: 'Já existe um utilizador cadastrado com este endereço de email.' };
    }

    const newUser: AppUser = {
      uid: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      email: cleanEmail,
      nome: cleanName,
      password: userData.password,
      papel: userData.papel || 'Administrador',
      telefone: userData.telefone || '',
      municipio: userData.municipio || 'Saurimo',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      criadoEm: new Date().toISOString(),
    };

    await saveUser(newUser);
    setRegisteredUsers((prev) => [newUser, ...prev]);

    // Iniciar sessão imediatamente com o novo utilizador
    setUserSession({
      uid: newUser.uid,
      email: newUser.email,
      nome: newUser.nome,
      papel: newUser.papel,
      avatarUrl: newUser.avatarUrl,
      telefone: newUser.telefone,
      municipio: newUser.municipio,
      criadoEm: newUser.criadoEm,
    });

    return { success: true, message: 'Conta cadastrada com sucesso!' };
  };

  // Login estrito por Email + Senha Cadastrada
  const login = async (emailInput: string, passInput: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = (emailInput || '').toLowerCase().trim();
    const cleanPass = (passInput || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, message: 'Por favor, insira o seu endereço de email e a palavra-passe.' };
    }

    // 1. Procurar na base de utilizadores registados (Firestore + Local)
    const customUser = await findUserByEmail(cleanEmail);
    if (customUser) {
      if (customUser.password && customUser.password !== cleanPass) {
        return { success: false, message: 'Palavra-passe incorreta para este email.' };
      }

      setUserSession({
        uid: customUser.uid,
        email: customUser.email,
        nome: customUser.nome,
        papel: customUser.papel,
        avatarUrl: customUser.avatarUrl,
        telefone: customUser.telefone,
        municipio: customUser.municipio,
        criadoEm: customUser.criadoEm,
      });
      return { success: true };
    }

    // 2. Procurar nas contas oficiais do sistema
    const matchedDemo = DEMO_ACCOUNTS.find(
      (d) => d.email.toLowerCase() === cleanEmail
    );

    if (matchedDemo) {
      if (
        cleanPass !== matchedDemo.password &&
        cleanPass !== matchedDemo.masterPin &&
        cleanPass !== 'admin'
      ) {
        return { success: false, message: 'Palavra-passe incorreta para este email.' };
      }

      setUserSession({
        uid: `uid-${matchedDemo.role.toLowerCase().replace(/\s+/g, '-')}`,
        email: matchedDemo.email,
        nome: matchedDemo.name,
        papel: matchedDemo.role,
        avatarUrl: matchedDemo.avatarUrl,
      });
      return { success: true };
    }

    return {
      success: false,
      message: 'Utilizador não encontrado. Verifique o email digitado ou cadastre uma nova conta.',
    };
  };

  // Funções de compatibilidade
  const loginWithPasswordOnly = async (passwordInput: string): Promise<{ success: boolean; message?: string }> => {
    return { success: false, message: 'É obrigatório informar o email e a palavra-passe cadastrados.' };
  };

  const loginWithEmailOnly = async (emailInput: string): Promise<{ success: boolean; message?: string }> => {
    return { success: false, message: 'É obrigatório informar a palavra-passe cadastrada.' };
  };

  const removeUser = async (uid: string) => {
    await deleteUserService(uid);
    setRegisteredUsers((prev) => prev.filter((u) => u.uid !== uid));
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
    setUserSession({
      uid: `uid-${matched.role.toLowerCase().replace(/\s+/g, '-')}`,
      email: matched.email,
      nome: matched.name,
      papel: matched.role,
      avatarUrl: matched.avatarUrl,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.papel : 'Visitante',
        isAuthenticated: !!user,
        demoUsers: DEMO_ACCOUNTS,
        registeredUsers,
        login,
        loginWithPasswordOnly,
        loginWithEmailOnly,
        registerUser,
        removeUser,
        logout,
        setQuickRole,
        refreshUsers: loadRegisteredUsers,
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
