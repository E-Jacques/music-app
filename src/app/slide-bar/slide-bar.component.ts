import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slide-bar',
  templateUrl: './slide-bar.component.html',
  styleUrls: ['./slide-bar.component.scss']
})
export class SlideBarComponent {
  @ViewChild("slidebar")
  slidebar!: ElementRef<HTMLDivElement>;

  @ViewChild("circle")
  circle!: ElementRef<HTMLDivElement>;

  @Input() rightPartColor = 'bg-gray-400';
  @Input() leftPartColor = 'bg-blue-400';
  @Input() circleColor = 'bg-blue-700';
  @Input() progression = 0;

  isDragging = false;

  onMouseDown() {
    this.isDragging = true;
  }

  onMouseUp() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const slideBarWidth = this.slidebar.nativeElement.offsetWidth;
      const circleRadius = this.circle.nativeElement.offsetWidth / 2;
      const deltaX = event.clientX - (this.slidebar.nativeElement.offsetParent as HTMLDivElement).offsetLeft - 2 * circleRadius;
      this.progression = Math.max(0, Math.min(100, (deltaX / slideBarWidth * 100)));
    }
  }
}
