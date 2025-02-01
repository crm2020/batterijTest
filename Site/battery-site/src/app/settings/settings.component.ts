import {Component, OnInit} from '@angular/core';
import {NavbarComponent} from "../navbar/navbar.component";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {SharedService} from "../services/shared.service";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    NavbarComponent,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit{
  users = [
    { id: 1, username: "John Doe", email: "john.doe@example.com" },
    { id: 2, username: "Jane Doe", email: "jane.doe@example.com" }
  ]

  devices = [
    { id: 1, name: "VRDB", active: true},
    { id: 2, name: "Test battery with a long name", active: false}
  ]

  isExpanded: boolean = true;

  constructor(private shared: SharedService) {}

  ngOnInit() {
    this.shared.sidebarExpanded$.subscribe(expanded => {
      this.isExpanded = expanded
    });
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.shared.setSidebarExpanded(this.isExpanded);
  }
}
