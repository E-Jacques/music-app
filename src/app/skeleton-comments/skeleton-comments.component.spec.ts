import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonCommentsComponent } from './skeleton-comments.component';

describe('SkeletonCommentsComponent', () => {
  let component: SkeletonCommentsComponent;
  let fixture: ComponentFixture<SkeletonCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkeletonCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkeletonCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
