import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser: User | null = null;

  constructor(private auth: Auth, private router: Router) {
    // Kullanıcı oturumu takip edilir
    onAuthStateChanged(this.auth, user => {
      this.currentUser = user;
    });
  }

  // ✅ Email/Şifre ile Giriş
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // ✅ Email/Şifre ile Kayıt
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // ✅ Google ile Giriş
  async googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      throw error;
    }
  }

  // ✅ Oturumu Sonlandır
  logout() {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  // ✅ Aktif kullanıcıyı getir
  getUser(): User | null {
    return this.auth.currentUser;
  }

  // ✅ Firebase Auth nesnesini al
  getAuth() {
    return this.auth;
  }
}