import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaylistMenuComponent } from './playlist-menu/playlist-menu.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { MusicControllerComponent } from './music-controller/music-controller.component';
import { SlideBarComponent } from './slide-bar/slide-bar.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeMenuComponent } from './home-menu/home-menu.component';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { SkeletonCardComponent } from './skeleton-card/skeleton-card.component';
import { PlaylistPageComponent } from './playlist-page/playlist-page.component';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaylistMenuComponent,
    UserMenuComponent,
    SearchBarComponent,
    MusicControllerComponent,
    SlideBarComponent,
    NavMenuComponent,
    HomeMenuComponent,
    CardComponent,
    SkeletonCardComponent,
    PlaylistPageComponent,
    PopupComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
