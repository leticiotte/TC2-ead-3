import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatabaseService } from '../database.service';
import { User } from '../models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user : User = { name: "", email: "", password: "" }
  username = ""
  password = ""

  constructor(private web : DatabaseService, private toastr: ToastrService, private router: Router) { }

  add(){
    this.web.addUser(this.user).subscribe(res => {
      console.log(res)
      if(res.ok == true){
        this.toastr.success("Cadastro realizado com sucesso!")
      }else{
        this.toastr.error("Não foi possível realizar o cadastro.")
      }
    });
  }

  login(){
    this.web.authenticateUser(this.username, this.password).subscribe(res => {
      if(res.ok == true){
        if((res.body as any).status == 'Erro'){
          this.toastr.error("Não foi possível realizar o login: " + ((res.body as any).msg))
          this.router.navigate(['/home']);
          return;
        }
        console.log(res)
        this.toastr.success("Login realizado com sucesso!", undefined, {
          timeOut: 2000,
        })
        sessionStorage.setItem("token", (res.body as any).token)
        sessionStorage.setItem("expiry", (res.body as any).expiry)
        this.router.navigate(['/messages']);
      }else{
        this.toastr.error("Não foi possível realizar o login: " + ((res.body as any).msg))
      }
    });
  }

  verifyIfTokenDoesntExpired(): void {
    const expiry = Number(sessionStorage.getItem("expiry"))
    if(expiry){
      const now = new Date().getTime()
      if(expiry>now){
        console.log('expiry maior')
        this.router.navigate(['/messages']);
      }else{
        console.log('expiry menor')
        sessionStorage.clear()
      }
    }
  }

  ngOnInit(): void {
    this.verifyIfTokenDoesntExpired()
  }

}
