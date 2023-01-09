import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockApiHandlerService } from '../api-services/mock-api-handler.service';
import { MockAuthService } from '../auth-services/mock-auth.service';
import { EventBusService } from '../event-bus.service';
import { EventData, EventDataEnum } from '../event-data';
import { OptionType } from '../multiple-select/multiple-select.component';

@Component({
  selector: 'app-add-form-page',
  templateUrl: './add-form-page.component.html',
  styleUrls: ['./add-form-page.component.scss'],
})
export class AddFormPageComponent implements OnInit {
  protected title = '';
  protected description = '';
  protected turnOffComment = false;
  protected musicFile?: File;
  protected artistIds: number[] = [];
  protected genreIds: number[] = [];

  protected loadingSubmit = false;

  protected artistOptions: OptionType[] = [];
  protected genreOptions: OptionType[] = [];

  constructor(
    private apiHandler: MockApiHandlerService,
    private authService: MockAuthService,
    private router: Router,
    private eventBus: EventBusService
  ) {}

  async ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.eventBus.emit(
        new EventData(
          EventDataEnum.ERROR_POPUP,
          "Can't access this page. Please login before."
        )
      );
      this.router.navigate(['auth']);
      return;
    }

    this.artistOptions = (await this.apiHandler.fetchAllArtists()).map((a) => ({
      value: a.artistID,
      display: a.name,
    }));

    this.genreOptions = (await this.apiHandler.fetchAllGenres()).map((a) => ({
      value: a.tagID,
      display: a.name,
    }));
  }

  setArtistIds(values: OptionType[]) {
    this.artistIds = values.map((a) => a.value);
  }

  setGenreIds(values: OptionType[]) {
    this.genreIds = values.map((a) => a.value);
  }

  getDurationFromFile(): number {
    if (!this.musicFile) {
      return 0;
    }

    return 0;
  }

  changeFile(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    this.musicFile = input.files[0];
  }

  async submit() {
    this.loadingSubmit = true;
    this.loadingSubmit = false;
  }
}
