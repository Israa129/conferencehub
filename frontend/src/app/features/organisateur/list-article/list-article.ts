import { Component, OnInit, signal, computed } from '@angular/core';
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
    const userString = localStorage.getItem('user');
    let userId: number | null = null;

    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        userId = userObj.id;
      } catch (e) {
        console.error("Erreur lors du parsing de l'objet utilisateur", e);
      }
    }

    if (userId) {
      this.articleService.getArticlesByOrganisateur("en_revision",userId).subscribe({
        next: (res) => {
          if (res.success) {
            this.articles.set(res.data);
          }
        },
        error: (err) => console.error('Erreur de chargement organisateur', err)
      });
    } else {
      console.error("Impossible de charger les articles : Aucun ID d'organisateur trouvé.");
    }
  }

  articlesNonValides = computed(() =>
    this.articles().filter(a => a.statut !== 'accepte')
  );

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