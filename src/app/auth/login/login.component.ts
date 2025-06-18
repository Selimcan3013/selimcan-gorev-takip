import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) {}

  async login(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = 'Hatalı e-posta veya şifre.';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async loginWithGoogle(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authService.googleLogin();
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.errorMessage = 'Google ile giriş başarısız.';
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}