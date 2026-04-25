export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'mentor' | 'peer_moderator' | 'admin';
  institutionId: string;
  preferredLanguage: string;
  visibilitySettings: VisibilitySettings;
  createdAt: Date;
}

export interface VisibilitySettings {
  profilePublic: boolean;
  showMajor: boolean;
  showChallenges: boolean;
  showIdentity: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  role: User['role'];
  institutionId: string;
  preferredLanguage: string;
}
