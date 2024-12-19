import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Stato dell'utente
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Stream osservabile

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post('http://localhost:8080/authenticate/login', { email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('jwtToken', res.jwt);
        this.isLoggedInSubject.next(true); // Aggiorna lo stato
      },
      error: (err) => console.error('Errore durante il login:', err)
    });
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.isLoggedInSubject.next(false); // Aggiorna lo stato
  }

  checkLoginState() {
    const token = localStorage.getItem('jwtToken');
    this.isLoggedInSubject.next(!!token);
  }
}
