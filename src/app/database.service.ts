import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Message } from './models/Message';
import { User } from './models/User';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  constructor(private http: HttpClient) {}

  baseURL = 'https://tiagoifsp.ddns.net/mensagens/jwt';

  async getMessages(token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return firstValueFrom(
      this.http.get<Message[]>(this.baseURL + '/msg.php', { headers: headers })
    );
  }

  addMessage(text: string, token: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    let body = new HttpParams();
    body = body.set('texto', text);
    return this.http.put(this.baseURL + '/msg.php', body, {
      headers: headers,
      observe: 'response',
    });
  }

  addUser(user: User) {
    let body = new HttpParams();
    body = body.set('nome', user.name);
    body = body.set('login', user.email);
    body = body.set('senha', user.password);
    return this.http.put(this.baseURL + '/user.php', body, {
      observe: 'response',
    });
  }

  authenticateUser(email: string, password: string) {
    let body = new HttpParams();
    body = body.set('login', email);
    body = body.set('senha', password);
    return this.http.post(this.baseURL + '/user.php', body, {
      observe: 'response',
    });
  }
}
