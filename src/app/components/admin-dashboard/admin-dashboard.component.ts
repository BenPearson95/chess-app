import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminFeedbackPageData } from 'src/app/_models/admin/admin-feedback-page-data';
import { AdminUserPageData } from 'src/app/_models/admin/admin-user-page-data';
import { AdminSection } from 'src/app/_models/enums/admin-section.enum';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  selectedSection: AdminSection = AdminSection.Users;
  users: Array<AdminUserPageData> = [];
  feedbacks: Array<AdminFeedbackPageData> = [];

  get AdminSection(): typeof AdminSection {
    return AdminSection;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.users = this.activatedRoute.snapshot.data.resolvedData.users;
    this.feedbacks = this.activatedRoute.snapshot.data.resolvedData.feedbacks;
  }

  ngOnInit(): void {
  }

}
