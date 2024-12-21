import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private errorLoginSubject = new BehaviorSubject<boolean>(false);
  errorLogin$ = this.errorLoginSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    this.http.post('http://localhost:8080/authenticate/login', { email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('jwtToken', res.jwt);
        this.isLoggedInSubject.next(true); // Aggiorna lo stato
      },
      error: (err) => {
        console.error('Errore durante il login:', err);
        this.errorLoginSubject.next(true);
      }
    });
  }



  

  logout() {
    localStorage.removeItem('jwtToken');
    this.isLoggedInSubject.next(false); // Aggiorna lo stato
    this.errorLoginSubject.next(false);
  }

  checkLoginState() {
    const token = localStorage.getItem('jwtToken');
    this.isLoggedInSubject.next(!!token);
  }

  isValidToken(token: string): boolean {
    try {
      if (!token) return false; // Verifica token vuoto o undefined
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }
}
