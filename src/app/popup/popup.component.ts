import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Input("message") message: String = "";
  @Output() clearPopup = new EventEmitter()

  constructor() {
    setTimeout(() => {
      this.clearPopup.emit()
    }, 3 * 1000)
  }
}