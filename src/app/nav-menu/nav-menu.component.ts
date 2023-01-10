import { Component } from '@angular/core';
import { AuthService } from '../auth-services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent {
  constructor(protected authService: AuthService) {}
}
