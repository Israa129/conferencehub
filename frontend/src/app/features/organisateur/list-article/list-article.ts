import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationArticle } from '../validation-article/validation-article';
import { Article, ArticleService } from '../../conferencier/services/article';

@Component({
  selector: 'app-list-article',
  standalone: true,
  imports: [CommonModule, ValidationArticle],
  templateUrl: './list-article.html',
  styleUrl: './list-article.scss',
})
export class ListArticle implements OnInit {
  articles = signal<Article[]>([]);
  articleSelectionne = signal<Article | null>(null);

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.chargerArticles();
  }

  chargerArticles(): void {
    this.articleService.getArticles('tous').subscribe({
      next: (res) => {
        if (res.success) {
          this.articles.set(res.data);
        }
      },
      error: (err) => console.error('Erreur de chargement', err)
    });
  }

  selectionner(article: Article): void {
    this.articleSelectionne.set(article);
  }

  onArticleMisAJour(articleMisAJour: Article): void {
    this.articles.update(liste =>
      liste.map(a => a._id === articleMisAJour._id ? articleMisAJour : a)
    );
    this.articleSelectionne.set(articleMisAJour);
  }
}