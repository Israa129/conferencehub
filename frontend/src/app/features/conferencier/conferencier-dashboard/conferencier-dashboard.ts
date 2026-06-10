import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService, Article, ArticleStats } from '../services/article';

@Component({
  selector: 'app-conferencier-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
  articleForm: FormGroup;

  user = { nom: 'Conferencier', initiales: 'CO', role: 'Conferencier' };

  articlesFiltres = computed(() => {
    let list = this.articles();
    if (this.filtreStatut() === 'tous') return list;
    list = list.filter(a => a.statut === this.filtreStatut());
    if (this.filtreConference() === 'toutes') return list;
    return list.filter(a => a.conference_id === this.filtreConference());
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

  constructor(private articleService: ArticleService, private fb: FormBuilder) {
    this.articleForm = this.fb.group({
      titre:           ['', [Validators.required, Validators.maxLength(255)]],
      resume:          ['', [Validators.required, Validators.maxLength(2000)]],
      mots_cles:       ['', Validators.required],
      conference_id:   ['', Validators.required],
      conference_nom:  [''],
      conference_lieu: [''],
    });
  }

  ngOnInit(): void { this.chargerArticles(); }

  chargerArticles(): void {
    this.loading.set(true);
    this.error.set(null);
    this.articleService.getArticles().subscribe({
      next: (res) => { this.articles.set(res.data); this.stats.set(res.stats); this.loading.set(false); },
      error: () => { this.error.set('Erreur lors du chargement.'); this.loading.set(false); }
    });
  }

  ouvrirModal(article?: Article): void {
    this.selectedFile = null;
    if (article) {
      this.editingArticle.set(article);
      this.articleForm.patchValue({
        titre: article.titre, resume: article.resume,
        mots_cles: article.mots_cles.join(', '),
        conference_id: article.conference_id,
        conference_nom: article.conference_nom,
        conference_lieu: article.conference_lieu,
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
    fd.append('titre', v.titre);
    fd.append('resume', v.resume);
    fd.append('conference_id', v.conference_id);
    fd.append('conference_nom', v.conference_nom ?? '');
    fd.append('conference_lieu', v.conference_lieu ?? '');
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

  setFiltreStatut(statut: string): void { this.filtreStatut.set(statut); }

  statutLabel(statut: string): string {
    const labels: Record<string, string> = { en_revision: 'En révision', accepte: 'Accepté', refuse: 'Refusé' };
    return labels[statut] ?? statut;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  trackById(_: number, item: Article): string { return item._id; }
}