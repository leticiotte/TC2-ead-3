import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../database.service';
import { Message } from '../models/Message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  listMessages: Message[] = [];
  message = ""

  constructor(
    private web: DatabaseService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  add(){
    const token = sessionStorage.getItem('token');
    if (!token || token == "undefined") {
      this.router.navigate(['/home']);
      return;
    }
    this.web.addMessage(this.message, token).subscribe(res => {
      if(res.ok == true){
        this.toastr.success("Mensagem enviada com sucesso!")
        this.loadMessages()
      }else{
        this.toastr.error("Não foi possível enviar a mensagem.")
      }
    });
  }

  logout(){
    sessionStorage.clear()
    this.toastr.success("Logout realizado com sucesso!", undefined, {
      timeOut: 2000,
    })
    this.router.navigate(['/home']);
  }

  async loadMessages(): Promise<void> {
    const token = sessionStorage.getItem('token');
    if (!token || token == "undefined") {
      this.router.navigate(['/home']);
      return;
    }
    this.listMessages = await this.web.getMessages(token);
    if((this.listMessages as any).status == 'Erro'){
      sessionStorage.clear()
      this.router.navigate(['/home']);
      return;
    }
  }

  ngOnInit(): void {
    this.loadMessages()
  }
}
