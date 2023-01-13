import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.scss'],
})
export class SlideBarComponent implements OnInit {
  @ViewChild('slidebar')
  slidebar!: ElementRef<HTMLDivElement>;

  @ViewChild('circle')
  circle!: ElementRef<HTMLDivElement>;

  @Input() rightPartColor = 'bg-gray-400';
  @Input() leftPartColor = 'bg-blue-400';
  @Input() circleColor = 'bg-blue-700';
  @Input('progression') progressionProp = 0;

  @Output() change = new EventEmitter<number>();

  isDragging = false;
  progression: number = 0;

  get leftPartWidth(): number {
    const p = this.isDragging ? this.progression : this.progressionProp;

    return 100 - p;
  }

  get rightPartWidth(): number {
    return this.isDragging ? this.progression : this.progressionProp;
  }

  get bubbleLeftPos(): number {
    return this.isDragging ? this.progression : this.progressionProp;
  }

  onMouseDown() {
    this.isDragging = true;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  ngOnInit(): void {
    this.progression = this.progressionProp;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const slideBarWidth = this.slidebar.nativeElement.offsetWidth;
      const circleRadius = this.circle.nativeElement.offsetWidth / 2;
      const deltaX =
        event.clientX -
        (this.slidebar.nativeElement.offsetParent as HTMLDivElement)
          .offsetLeft -
        2 * circleRadius;
      this.progression = Math.max(
        0,
        Math.min(100, (deltaX / slideBarWidth) * 100)
      );
      this.change.emit(this.progression);
    } else {
      this.progression = this.progressionProp;
    }
  }
}
