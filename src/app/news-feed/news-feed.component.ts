import { Component, OnInit } from '@angular/core';
import { signOut } from '@aws-amplify/auth';
import { Router } from '@angular/router';
import {NewsService} from '../services/newsService';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit {
  noticias: any[] = [];
  comentarioAtual = '';
  comentarioAtualPorNoticia: { [index: number]: string } = {};
  noticiaSelecionada: number | null = null;
  modalAberto = false;

  currentPage = 1;
  pageSize = 5;

  constructor(private router: Router, private service: NewsService ) { }

  async logout() {
    await signOut();
    localStorage.removeItem('cognitoUser');
    this.router.navigate(['/']);
  }

  async ngOnInit() {
    this.service.getNews().subscribe(
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

  get totalPages(): number {
    return Math.ceil(this.noticias.length / this.pageSize);
  }

  get noticiasPaginadas() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.noticias.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  abrirComentarios(index: number) {
    this.noticiaSelecionada = index;
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.comentarioAtual = '';
  }

  adicionarComentario() {
    if (this.comentarioAtual.trim() && this.noticiaSelecionada !== null) {
      const noticia = this.noticias[this.noticiaSelecionada];
      if (!noticia.uuid) {
        console.error('UUID da notícia não definido!');
        return;
      }
      const comentario = {
        texto: this.comentarioAtual.trim(),
        data: new Date().toLocaleDateString('pt-BR')
      };
      this.service.addComentario(noticia.uuid, comentario).subscribe({
        next: (res) => {
          noticia.comentarios.push(comentario);
          this.comentarioAtual = '';
        },
        error: (err) => {
          console.error('Erro ao adicionar comentário:', err);
        }
      });
    }
  }

  adicionarComentarioDireto(index: number) {
    const texto = this.comentarioAtualPorNoticia[index]?.trim();
    if (texto) {
      const noticia = this.noticias[index];
      if (!noticia.uuid) {
        console.error('UUID da notícia não definido!');
        return;
      }
      const comentario = {
        texto,
        data: new Date().toLocaleDateString('pt-BR')
      };
      this.service.addComentario(noticia.uuid, comentario).subscribe({
        next: (res) => {
          noticia.comentarios.push(comentario);
          this.comentarioAtualPorNoticia[index] = '';
        },
        error: (err) => {
          console.error('Erro ao adicionar comentário:', err);
        }
      });
    }
  }

}
