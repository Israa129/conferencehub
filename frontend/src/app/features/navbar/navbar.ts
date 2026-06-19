import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { UserStateService } from '../../core/services/user-state';
import { ParticipantService } from '../../core/services/participant.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isAuthPage = false;

  // Notifications
  notifications: any[] = [];
  notifOuverte = false;

  constructor(
    public userState: UserStateService,
    private router: Router,
    private participantService: ParticipantService
  ) {}

  ngOnInit() {
    this.checkPage(this.router.url);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkPage(event.url);
        this.userState.refresh();
        // Recharger notifs si participant
        if (this.userState.user()?.role === 'participant') {
          this.chargerNotifications();
        }
      }
    });

    if (this.userState.user()?.role === 'participant') {
      this.chargerNotifications();
    }
  }

  checkPage(url: string) {
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    this.isAuthPage = authPages.some(p => url.startsWith(p));
  }

  // Fermer le dropdown si clic ailleurs
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notif-wrapper')) {
      this.notifOuverte = false;
    }
  }

  chargerNotifications() {
    this.participantService.getDashboard().subscribe({
      next: (data: any) => {
        this.notifications = this.genererNotifications(data);
      },
      error: () => {}
    });
  }

  genererNotifications(data: any): any[] {
    const notifs: any[] = [];

    // Inscription confirmée
    if (data.inscriptionActive) {
      notifs.push({
        type: 'success',
        icon: '✅',
        titre: 'Inscription confirmée',
        message: `Vous êtes inscrit à ${data.inscriptionActive.conference?.nom}`,
        date: data.inscriptionActive.conference?.dates,
      });
    }

    // Conférence bientôt
    if (data.prochainEvenement) {
      const j = data.prochainEvenement.countdown?.jours;
      if (j !== undefined && j <= 30) {
        notifs.push({
          type: 'info',
          icon: '📅',
          titre: 'Conférence bientôt',
          message: `${data.prochainEvenement.nom} dans ${j} jour${j > 1 ? 's' : ''}`,
          date: data.prochainEvenement.nom,
        });
      }
    }

    // Attestation disponible
    const avecAttestation = (data.inscriptions ?? []).filter((i: any) => i.pdf_url);
    avecAttestation.forEach((i: any) => {
      notifs.push({
        type: 'success',
        icon: '📜',
        titre: 'Attestation disponible',
        message: `Votre attestation pour ${i.conference?.nom} est prête`,
        date: i.date_inscription,
      });
    });

    return notifs;
  }

  get nbNonLues(): number {
    return this.notifications.length;
  }

  toggleNotif() {
    this.notifOuverte = !this.notifOuverte;
  }

  logout() {
    this.userState.logout();
    this.router.navigate(['/']);
  }
}