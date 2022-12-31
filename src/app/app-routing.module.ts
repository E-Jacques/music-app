import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsPageComponent } from './artists-page/artists-page.component';
import { GenrePageComponent } from './genre-page/genre-page.component';
import { HomeMenuComponent } from './home-menu/home-menu.component';
import { PlaylistMenuComponent } from './playlist-menu/playlist-menu.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

const routes: Routes = [
  { path: '', component: HomeMenuComponent },
  { path: 'playlist/:id', component: PlaylistPageComponent },
  { path: 'playlist', component: PlaylistMenuComponent },
  { path: 'user', component: UserMenuComponent },
  { path: 'artists/:id', component: ArtistsPageComponent },
  { path: 'genres', component: GenrePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
