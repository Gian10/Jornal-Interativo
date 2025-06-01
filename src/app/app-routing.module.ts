import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { NewsFeedComponent } from './news-feed/news-feed.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent}  from './login/login.component';
import { NewsAdminComponent } from './news-admin/news-admin.component';
import { AuthAdminGuard } from './auth.admin.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'news', component: NewsFeedComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: NewsAdminComponent, canActivate: [AuthAdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
