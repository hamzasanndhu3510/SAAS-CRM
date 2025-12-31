
import { UserProfile } from '../types';

const STORAGE_KEY = 'pakcrm_user_profile';

const DEFAULT_PROFILE: UserProfile = {
  id: 'u-1',
  name: 'Mustafa Ahmed',
  email: 'mustafa@ahmedestate.com',
  businessName: 'Ahmed Real Estate Lahore',
  role: 'ADMIN',
  tenant_id: 'tenant-786',
  avatarColor: 'bg-indigo-600'
};

export const AuthService = {
  getProfile: (): UserProfile => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      AuthService.updateProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    return JSON.parse(data);
  },
  updateProfile: (profile: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
};