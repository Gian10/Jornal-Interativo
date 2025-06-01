import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from '../services/newsService';
import { Router } from '@angular/router';
import { fetchAuthSession } from '@aws-amplify/auth';

@Component({
  selector: 'app-news-admin',
  templateUrl: './news-admin.component.html',
  styleUrls: ['./news-admin.component.scss']
})
export class NewsAdminComponent implements OnInit {
  newsForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';
  noticias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private router: Router
  ) {
    this.newsForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      resumo: ['', [Validators.required, Validators.maxLength(300)]],
      data: ['', Validators.required]
    });
  }

  async isAdminUser(): Promise<boolean> {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.payload;
    const groups = idToken && idToken['cognito:groups'];
    return Array.isArray(groups) && groups.includes('admin');
  }

  async ngOnInit() {
    if (!(await this.isAdminUser())) {
      this.router.navigate(['/']);
      return;
    }

    this.newsService.getNews().subscribe(
      data => {
        this.noticias = (Array.isArray(data) ? data : []).map(n => ({
          uuid: n.uuid, 
          titulo: n.titulo,
          resumo: n.resumo,
          data: n.data,
          comentarios: Array.isArray(n.comentarios)
            ? (n.comentarios as any[]).map((c: any) => ({ texto: c.texto, data: c.data || c.dataTeste || '' }))
            : n.comentarios
              ? [{ texto: n.comentarios.texto, data: n.comentarios.data || n.comentarios.dataTeste || '' }]
              : []
        }));
        console.log('Notícias recebidas:', this.noticias);
      },
      error => {
        console.error('Erro ao buscar notícias:', error);
      }
    );
  }

  submit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.newsForm.invalid) return;
    this.loading = true;
    const noticia = {
      ...this.newsForm.value,
      uuid: Date.now().toString(),
      comentarios: []
    };
    this.newsService.postNews(noticia).subscribe({
      next: () => {
        this.successMsg = 'Notícia cadastrada com sucesso!';
        this.newsForm.reset();
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'Erro ao cadastrar notícia.';
        this.loading = false;
      }
    });
  }

  goToNews() {
    // Navega para o feed de notícias
    window.location.href = '/news';
    // Alternativamente, se preferir usar o Router:
    // this.router.navigate(['/news']);
  }
}