import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Article, ArticleService } from '../../conferencier/services/article'; // Ajuste selon ton arborescence

@Component({
  selector: 'app-validation-article',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validation-article.html',
  styleUrl: './validation-article.scss',
})
export class ValidationArticle implements OnChanges {
  @Input() article: Article | null = null;
  
  @Output() articleMisAJour = new EventEmitter<Article>();

  commentaireSaisi = '';
  isSaving = false;

  constructor(private articleService: ArticleService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['article'] && this.article) {
      this.commentaireSaisi = this.article.commentaires || '';
    }
  }

  traiterArticle(nouveauStatut: 'accepte' | 'refuse'): void {
    if (!this.article) return;

    this.isSaving = true;

    this.articleService.changerStatut(this.article._id, nouveauStatut, this.commentaireSaisi).subscribe({
      next: (res) => {
        if (res.success) {
          alert(`L'article a été mis à jour avec le statut : ${nouveauStatut}`);
          this.articleMisAJour.emit(res.data);
        }
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Erreur lors du changement de statut', err);
        this.isSaving = false;
      }
    });
  }

  telechargerFichier(): void {
    if (!this.article) return;

    this.articleService.telechargerPdf(this.article._id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nomFichier = this.article?.titre ? this.article.titre.replace(/\s+/g, '_') : 'article';
        a.download = `${nomFichier}.pdf`;
        a.click();
      },
      error: (err) => console.error('Erreur de téléchargement', err)
    });
  }
}