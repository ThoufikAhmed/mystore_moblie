export interface Address {
  id: string;
  label: string;
  name: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pin: string;
  isDefault: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  addresses: Address[];
}
