import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ArticleService, Article, ArticleStats } from '../services/article';
import { UserStateService } from '../../../core/services/user-state';
import { ActivatedRoute, Router } from '@angular/router';

interface ConferenceInfo {
  id: string;
  titre?: string;
  lieu?: string;
  date_debut?: string;
  date_fin?: string;
}

interface SessionOption {
  id: string;
  label: string;
}

const API_BASE = 'http://127.0.0.1:8000/api';

@Component({
  selector: 'app-conferencier-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conferencier-dashboard.html',
  styleUrl: './conferencier-dashboard.scss'
})
export class ConferencierDashboard implements OnInit {

  articles = signal<Article[]>([]);
  stats = signal<ArticleStats>({ total: 0, en_revision: 0, accepte: 0, refuse: 0, par_conference: {} });
  loading = signal(false);
  loadingSubmit = signal(false);
  error = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  showModal = signal(false);
  showDeleteConfirm = signal(false);
  editingArticle = signal<Article | null>(null);
  articleToDelete = signal<Article | null>(null);
  selectedArticle = signal<Article | null>(null);
  showDetailPanel = signal(false);
  filtreStatut = signal('tous');
  filtreConference = signal('toutes');
  dragOver = signal(false);
  selectedFile: File | null = null;

  conferenceInfo = signal<Record<string, ConferenceInfo>>({});
  selectedConferenceId = signal('');
  mode = signal<'dashboard' | 'articles' | 'archives' | 'soumettre'>('dashboard');
  notifications = signal<{ titre: string; statut: string }[]>([]);
  showNotifications = signal(false);
  sessionsConference = signal<SessionOption[]>([]);
  loadingSessions = signal(false);

  articleForm: FormGroup;

  constructor(
    private articleService: ArticleService,
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public userState: UserStateService
  ) {
    this.articleForm = this.fb.group({
      titre:            ['', [Validators.required, Validators.maxLength(255)]],
      resume:           ['', [Validators.required, Validators.maxLength(2000)]],
      mots_cles:        ['', Validators.required],
      conference_id:    ['', Validators.required],
      conference_nom:   ['', Validators.required],
      conference_lieu:  [''],
      session_assignee: [''],
    });
  }

  get user() {
    const u = this.userState.user();
    const prenom = (u as any)?.prenom ?? '';
    const nom = (u as any)?.nom ?? '';
    return {
      nom: u ? `${prenom} ${nom}`.trim() || 'Conférencier' : 'Conférencier',
      initiales: u ? `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || 'CO' : 'CO',
      role: (u as any)?.role ?? 'conferencier',
      id: (u as any)?.id ?? null,
    };
  }

  ngOnInit(): void {
    this.mode.set((this.route.snapshot.data['mode'] as any) ?? 'dashboard');
    this.chargerArticles();

    if (this.mode() === 'soumettre') {
      setTimeout(() => this.ouvrirModal());
    }

    this.articleForm.get('conference_id')?.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((id: string) => {
        this.selectedConferenceId.set(id ?? '');
        if (id) {
          this.chargerInfoConference(id, true);
          this.chargerSessions(id);
        } else {
          this.sessionsConference.set([]);
        }
      });
  }

  // ── Chargement articles ───────────────────────────────
  chargerArticles(): void {
    this.loading.set(true);
    this.error.set(null);
    this.articleService.getArticles().subscribe({
      next: (res) => {
        this.articles.set(res.data);
        this.stats.set(res.stats);
        this.loading.set(false);
        this.checkNotifications(res.data);
        const ids = new Set(res.data.map(a => a.conference_id));
        ids.forEach(id => this.chargerInfoConference(id, false));
      },
      error: () => { this.error.set('Erreur lors du chargement.'); this.loading.set(false); }
    });
  }

  // ── Conférence (dates, lieu, titre) ───────────────────
  private chargerInfoConference(id: string, autoFillForm: boolean): void {
    if (!id) return;
    this.http.get<any>(`${API_BASE}/conferences/${id}`).subscribe({
      next: (res) => {
        const c = res?.data ?? res;
        this.conferenceInfo.update(map => ({
          ...map,
          [id]: {
            id,
            titre: c?.titre,
            lieu: c?.lieu,
            date_debut: c?.date_debut,
            date_fin: c?.date_fin,
          }
        }));
        if (autoFillForm) {
          if (!this.articleForm.get('conference_nom')?.value) {
            this.articleForm.patchValue({ conference_nom: c?.titre ?? '' }, { emitEvent: false });
          }
          if (!this.articleForm.get('conference_lieu')?.value) {
            this.articleForm.patchValue({ conference_lieu: c?.lieu ?? '' }, { emitEvent: false });
          }
        }
      },
      error: () => { /* conférence introuvable : ignoré */ }
    });
  }

  // ── Sessions de la conférence sélectionnée ────────────
  private chargerSessions(conferenceId: string): void {
    this.loadingSessions.set(true);
    this.sessionsConference.set([]);
    this.http.get<any>(`${API_BASE}/sessions`).subscribe({
      next: (res) => {
        const list: any[] = res?.data ?? res ?? [];
        const filtered = list
          .filter(s => String(s.conference_id) === String(conferenceId))
          .map(s => ({
            id: String(s.id),
            label: s.titre ?? s.nom ?? s.intitule ?? `Session ${s.id}`,
          }));
        this.sessionsConference.set(filtered);
        this.loadingSessions.set(false);
      },
      error: () => { this.sessionsConference.set([]); this.loadingSessions.set(false); }
    });
  }

  // ── Computed ───────────────────────────────────────────
  articlesFiltres = computed(() => {
    let list = this.articles();

    if (this.mode() === 'archives') {
      list = list.filter(a => a.statut !== 'en_revision');
    }
    if (this.filtreStatut() !== 'tous') list = list.filter(a => a.statut === this.filtreStatut());
    if (this.filtreConference() !== 'toutes') list = list.filter(a => a.conference_id === this.filtreConference());
    return list;
  });

  conferencesDisponibles = computed(() => {
    const ids = new Set<string>();
    const result: { id: string; nom: string }[] = [];
    for (const a of this.articles()) {
      if (!ids.has(a.conference_id)) {
        ids.add(a.conference_id);
        result.push({ id: a.conference_id, nom: a.conference_nom });
      }
    }
    return result;
  });

  articleAccepte = computed(() => this.articles().find(a => a.statut === 'accepte') ?? null);

  // ── Modal soumission ────────────────────────────────────
  ouvrirModal(article?: Article): void {
    this.selectedFile = null;
    this.sessionsConference.set([]);
    if (article) {
      this.editingArticle.set(article);
      this.articleForm.patchValue({
        titre: article.titre,
        resume: article.resume,
        mots_cles: article.mots_cles.join(', '),
        conference_id: article.conference_id,
        conference_nom: article.conference_nom,
        conference_lieu: article.conference_lieu,
        session_assignee: article.session_assignee ?? '',
      });
    } else {
      this.editingArticle.set(null);
      this.articleForm.reset();
    }
    this.showModal.set(true);
  }

  fermerModal(): void {
    this.showModal.set(false);
    this.editingArticle.set(null);
    this.articleForm.reset();
    this.selectedFile = null;
    this.sessionsConference.set([]);

    if (this.mode() === 'soumettre') {
      this.router.navigate(['/conferencier/dashboard']);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver.set(false);
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/pdf') this.selectedFile = file;
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.[0]) this.selectedFile = input.files[0];
  }

  soumettre(): void {
    if (this.articleForm.invalid) { this.articleForm.markAllAsTouched(); return; }
    const editing = this.editingArticle();
    if (!editing && !this.selectedFile) { this.error.set('Veuillez joindre un fichier PDF.'); return; }

    this.loadingSubmit.set(true);
    this.error.set(null);

    const fd = new FormData();
    const v = this.articleForm.value;
    const u = this.user;

    fd.append('titre', v.titre);
    fd.append('resume', v.resume);
    fd.append('conference_id', v.conference_id);
    fd.append('conference_nom', v.conference_nom ?? '');
    fd.append('conference_lieu', v.conference_lieu ?? '');
    fd.append('session_assignee', v.session_assignee ?? '');
    fd.append('conferencier_id', String(u.id ?? ''));
    fd.append('conferencier_nom', u.nom);

    (v.mots_cles as string).split(',').map((m: string) => m.trim()).filter(Boolean)
      .forEach((m: string) => fd.append('mots_cles[]', m));

    if (this.selectedFile) fd.append('fichier_pdf', this.selectedFile);

    const obs$ = editing ? this.articleService.modifier(editing._id, fd) : this.articleService.soumettre(fd);
    obs$.subscribe({
      next: (res) => {
        this.successMsg.set(res.message);
        this.loadingSubmit.set(false);
        this.fermerModal();
        this.chargerArticles();
        setTimeout(() => this.successMsg.set(null), 4000);
      },
      error: () => { this.error.set('Erreur lors de la soumission.'); this.loadingSubmit.set(false); }
    });
  }

  // ── Suppression ─────────────────────────────────────────
  confirmerSuppression(article: Article): void {
    this.articleToDelete.set(article);
    this.showDeleteConfirm.set(true);
  }

  supprimerArticle(): void {
    const article = this.articleToDelete();
    if (!article) return;
    this.articleService.supprimer(article._id).subscribe({
      next: (res) => {
        this.successMsg.set(res.message);
        this.showDeleteConfirm.set(false);
        this.articleToDelete.set(null);
        this.chargerArticles();
        setTimeout(() => this.successMsg.set(null), 4000);
      },
      error: () => this.error.set('Erreur lors de la suppression.')
    });
  }

  // ── Détail / téléchargement ─────────────────────────────
  voirDetail(article: Article): void { this.selectedArticle.set(article); this.showDetailPanel.set(true); }
  fermerDetail(): void { this.showDetailPanel.set(false); this.selectedArticle.set(null); }

  telecharger(article: Article): void {
    this.articleService.telechargerPdf(article._id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = article.titre + '.pdf'; a.click();
      URL.revokeObjectURL(url);
    });
  }

  // ── Notifications (changement de statut) ────────────────
  private checkNotifications(newArticles: Article[]): void {
    const key = 'conferencier_statuts_' + (this.user.id ?? 'anon');
    const stored = JSON.parse(localStorage.getItem(key) ?? '{}') as Record<string, string>;
    const notifs: { titre: string; statut: string }[] = [];

    newArticles.forEach(a => {
      const previous = stored[a._id];
      if (previous && previous !== a.statut && (a.statut === 'accepte' || a.statut === 'refuse')) {
        notifs.push({ titre: a.titre, statut: a.statut });
      }
      stored[a._id] = a.statut;
    });

    localStorage.setItem(key, JSON.stringify(stored));
    if (notifs.length > 0) this.notifications.set(notifs);
  }

  toggleNotifications(): void { this.showNotifications.update(v => !v); }
  clearNotifications(): void { this.notifications.set([]); this.showNotifications.set(false); }

  // ── Filtres / helpers ────────────────────────────────────
  setFiltreStatut(statut: string): void { this.filtreStatut.set(statut); }
  setFiltreConference(id: string): void { this.filtreConference.set(id); }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = { en_revision: 'En révision', accepte: 'Accepté', refuse: 'Refusé' };
    return labels[statut] ?? statut;
  }

  formatDate(date?: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  conferenceDates(conferenceId: string): { debut?: string; fin?: string } {
    const info = this.conferenceInfo()[conferenceId];
    return { debut: info?.date_debut, fin: info?.date_fin };
  }

  trackById(_: number, item: Article): string { return item._id; }
}