import { Component, Input, OnInit } from '@angular/core';
import { AdminUserPageData } from 'src/app/_models/admin/admin-user-page-data';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  @Input() users: Array<AdminUserPageData>

  constructor() { }

  ngOnInit(): void {
  }

}
