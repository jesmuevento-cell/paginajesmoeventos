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

  // Login flexível por Email ou Email + Senha
  const login = async (emailInput: string, passInput: string = ''): Promise<{ success: boolean; message?: string }> => {
    const lower = (emailInput || '').toLowerCase().trim();
    const pass = (passInput || '').trim();

    // Se inseriu apenas senha no campo de login direto
    if (!lower && pass) {
      return loginWithPasswordOnly(pass);
    }

    // 1. Procurar nas contas de demonstração conhecidas
    const matchedDemo = DEMO_ACCOUNTS.find(
      (d) =>
        d.email.toLowerCase() === lower ||
        lower === d.role.toLowerCase() ||
        (lower.includes('super') && d.role === 'Super Administrador') ||
        (lower.includes('juri') && d.role === 'Júri') ||
        (lower.includes('editor') && d.role === 'Editor')
    );

    if (matchedDemo) {
      if (pass && pass.toLowerCase() !== matchedDemo.password.toLowerCase() && pass.toLowerCase() !== matchedDemo.masterPin?.toLowerCase() && pass !== 'admin') {
        return { success: false, message: 'Palavra-passe incorreta para esta conta.' };
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

    // 2. Procurar na base de utilizadores registados (Firestore + Local)
    const customUser = await findUserByEmail(lower);
    if (customUser) {
      if (pass && customUser.password && customUser.password !== pass) {
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

    // 3. Se forneceu email válido no formato institucional
    if (lower.includes('@') && lower.length > 5) {
      const role: UserRole = lower.includes('juri')
        ? 'Júri'
        : lower.includes('editor') || lower.includes('imprensa')
        ? 'Editor'
        : lower.includes('super')
        ? 'Super Administrador'
        : 'Administrador';

      setUserSession({
        uid: `uid-user-${Date.now()}`,
        email: lower,
        nome: lower.split('@')[0].toUpperCase(),
        papel: role,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
      return { success: true };
    }

    // 4. Fallback se forneceu código/senha
    if (lower.length >= 3) {
      return loginWithPasswordOnly(lower);
    }

    return { success: false, message: 'Utilizador não encontrado. Verifique os dados ou crie uma conta.' };
  };

  // Login exclusivo por Senha / Código de Acesso
  const loginWithPasswordOnly = async (passwordInput: string): Promise<{ success: boolean; message?: string }> => {
    const p = (passwordInput || '').trim().toLowerCase();

    if (!p) return { success: false, message: 'Digite a sua palavra-passe ou PIN de acesso.' };

    // Senhas especiais do Super Admin
    if (p === 'admin' || p === 'superadmin' || p === 'super2026' || p === 'thevoice2026' || p === '123456') {
      const demo = DEMO_ACCOUNTS[0]; // Super Administrador
      setUserSession({
        uid: 'uid-superadmin',
        email: demo.email,
        nome: demo.name,
        papel: 'Super Administrador',
        avatarUrl: demo.avatarUrl,
      });
      return { success: true };
    }

    // Senhas de Administrador
    if (p === 'admin2026' || p === 'organizacao' || p === 'comissao') {
      const demo = DEMO_ACCOUNTS[1];
      setUserSession({
        uid: 'uid-admin',
        email: demo.email,
        nome: demo.name,
        papel: 'Administrador',
        avatarUrl: demo.avatarUrl,
      });
      return { success: true };
    }

    // Senhas de Júri
    if (p === 'juri' || p === 'jurado' || p === 'juri2026' || p === 'notas') {
      const demo = DEMO_ACCOUNTS[2];
      setUserSession({
        uid: 'uid-juri',
        email: demo.email,
        nome: demo.name,
        papel: 'Júri',
        avatarUrl: demo.avatarUrl,
      });
      return { success: true };
    }

    // Senhas de Editor / Imprensa
    if (p === 'editor' || p === 'imprensa' || p === 'imprensa2026' || p === 'noticias') {
      const demo = DEMO_ACCOUNTS[3];
      setUserSession({
        uid: 'uid-editor',
        email: demo.email,
        nome: demo.name,
        papel: 'Editor',
        avatarUrl: demo.avatarUrl,
      });
      return { success: true };
    }

    // Verificar se corresponde a alguma senha de utilizador cadastrado
    const matchedCustom = registeredUsers.find((u) => u.password && u.password.toLowerCase() === p);
    if (matchedCustom) {
      setUserSession({
        uid: matchedCustom.uid,
        email: matchedCustom.email,
        nome: matchedCustom.nome,
        papel: matchedCustom.papel,
        avatarUrl: matchedCustom.avatarUrl,
        telefone: matchedCustom.telefone,
        municipio: matchedCustom.municipio,
        criadoEm: matchedCustom.criadoEm,
      });
      return { success: true };
    }

    // Se inseriu qualquer senha com pelo menos 4 caracteres
    if (p.length >= 4) {
      setUserSession({
        uid: `uid-session-${Date.now()}`,
        email: 'gestor@thevoicelundasul.ao',
        nome: 'Gestor Autorizado',
        papel: 'Administrador',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      });
      return { success: true };
    }

    return { success: false, message: 'Palavra-passe não reconhecida. Tente "admin" ou cadastre-se.' };
  };

  // Login exclusivo por Email
  const loginWithEmailOnly = async (emailInput: string): Promise<{ success: boolean; message?: string }> => {
    return login(emailInput, '');
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
