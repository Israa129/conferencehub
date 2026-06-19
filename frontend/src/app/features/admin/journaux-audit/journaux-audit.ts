import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditLogService } from '../../../core/services/audit-log';

@Component({
  selector: 'app-journaux-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './journaux-audit.html',
  styleUrl: './journaux-audit.scss'
})
export class JournauxAudit implements OnInit {
  logs: any[] = [];
  actions: string[] = [];

  loading = false;

  search = '';
  role = '';
  action = '';

  currentPage = 1;
  lastPage = 1;
  total = 0;

  constructor(
    private auditService: AuditLogService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadActions();
    this.loadLogs();
  }

  loadLogs(page: number = 1): void {
    this.loading = true;
    this.currentPage = page;

    this.auditService.getLogs({
      search: this.search,
      role: this.role,
      action: this.action,
      page: this.currentPage
    }).subscribe({
      next: (res) => {
        console.log('AUDIT LOGS RESPONSE:', res);

        this.logs = res?.data ?? [];
        this.currentPage = res?.current_page ?? 1;
        this.lastPage = res?.last_page ?? 1;
        this.total = res?.total ?? 0;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur audit logs:', err);

        this.logs = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadActions(): void {
    this.auditService.getActions().subscribe({
      next: (actions) => {
        this.actions = actions ?? [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur actions:', err);
        this.actions = [];
        this.cdr.detectChanges();
      }
    });
  }

  resetFilters(): void {
    this.search = '';
    this.role = '';
    this.action = '';
    this.loadLogs(1);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadLogs(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.lastPage) {
      this.loadLogs(this.currentPage + 1);
    }
  }
}