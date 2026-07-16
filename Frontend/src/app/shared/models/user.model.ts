export interface User {
  id:         number;
  voornaam:   string;
  achternaam: string;
  email:      string;
  role:       'student' | 'teacher';
  klas?:      string;
  klas_id?:   number;
}

export interface LoginRequest {
  email:    string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user:  User;
}

export interface RegisterRequest {
  voornaam:   string;
  achternaam: string;
  email:      string;
  password:   string;
  role:       'student' | 'teacher';
  klas?:      string;
}