import { Component, OnInit } from '@angular/core';
import { signOut } from '@aws-amplify/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-feed',
  templateUrl: './news-feed.component.html',
  styleUrls: ['./news-feed.component.scss']
})
export class NewsFeedComponent implements OnInit {
  noticias = [
    {
      titulo: 'Avanço da Inteligência Artificial transforma o mercado de trabalho',
      resumo: 'Especialistas apontam que a adoção acelerada de IA está redefinindo profissões, exigindo novas habilidades e promovendo a automação de tarefas repetitivas.',
      data: new Date()
    },
    {
      titulo: 'Mudanças climáticas: cidades investem em soluções sustentáveis',
      resumo: 'Prefeituras de grandes centros urbanos implementam políticas inovadoras para reduzir emissões e adaptar infraestruturas aos desafios ambientais.',
      data: new Date()
    },
    {
      titulo: 'Educação digital cresce e amplia acesso ao ensino de qualidade',
      resumo: 'Plataformas online e recursos interativos impulsionam a democratização do conhecimento, aproximando estudantes de diferentes regiões.',
      data: new Date()
    },
    {
      titulo: 'Educação digital cresce e amplia acesso ao ensino de qualidade',
      resumo: 'Plataformas online e recursos interativos impulsionam a democratização do conhecimento, aproximando estudantes de diferentes regiões.',
      data: new Date()
    },
    {
      titulo: 'Educação digital cresce e amplia acesso ao ensino de qualidade',
      resumo: 'Plataformas online e recursos interativos impulsionam a democratização do conhecimento, aproximando estudantes de diferentes regiões.',
      data: new Date()
    },
    {
      titulo: 'Educação digital cresce e amplia acesso ao ensino de qualidade',
      resumo: 'Plataformas online e recursos interativos impulsionam a democratização do conhecimento, aproximando estudantes de diferentes regiões.',
      data: new Date()
    }
  ];

  comentarios: { [index: number]: { texto: string, data: Date }[] } = {};
  comentarioAtual = '';
  comentarioAtualPorNoticia: { [index: number]: string } = {};
  noticiaSelecionada: number | null = null;
  modalAberto = false;

  currentPage = 1;
  pageSize = 5;

  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  async logout() {
    await signOut();
    localStorage.removeItem('cognitoUser');
    this.router.navigate(['/']);
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
    if (!this.comentarios[index]) {
      this.comentarios[index] = [];
    }
  }

  fecharModal() {
    this.modalAberto = false;
    this.comentarioAtual = '';
  }

  adicionarComentario() {
    if (this.comentarioAtual.trim() && this.noticiaSelecionada !== null) {
      this.comentarios[this.noticiaSelecionada].push({
        texto: this.comentarioAtual.trim(),
        data: new Date()
      });
      this.comentarioAtual = '';
    }
  }

  adicionarComentarioDireto(index: number) {
    const texto = this.comentarioAtualPorNoticia[index]?.trim();
    if (texto) {
      if (!this.comentarios[index]) {
        this.comentarios[index] = [];
      }
      this.comentarios[index].push({
        texto,
        data: new Date()
      });
      this.comentarioAtualPorNoticia[index] = '';
    }
  }

}
