import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  data = "";

  @Input("placeholder") placeholder = "";

  @Output("query") queryEvent = new EventEmitter();

  query () {
    this.queryEvent.emit(this.data);
  }
}
