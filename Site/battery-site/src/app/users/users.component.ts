import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {SharedService} from "../services/shared.service";
import {NgForOf, NgIf} from "@angular/common";
import {SessionService} from "../services/session.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../models/user.model";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  isExpanded: boolean = true;
  userData: any;

  testUsers = [
    { id: 1, name: "John Doe", username: "JohnD", email: "johndoe@example.com", admin: true },
    { id: 2, name: "Jane Doe", username: "JaneD", email: "janedoe@example.com", admin: false },
  ]

  users: User[] = [];

  constructor(private shared: SharedService, public session: SessionService, private modalService: NgbModal, private api: ApiService) {
  }

  ngOnInit() {
    this.shared.sidebarExpanded$.subscribe(expanded => {
      this.isExpanded = expanded
    });

    this.api.getAllUsers().subscribe((data) => {
      this.users = data;
    })
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.shared.setSidebarExpanded(this.isExpanded);
  }

  openModal(content: any, user: any) {
    this.userData = user;
    this.modalService.open(content);
  }

  createNewUser() {

  }
}
