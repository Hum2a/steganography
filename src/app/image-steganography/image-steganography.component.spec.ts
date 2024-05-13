import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSteganographyComponent } from './image-steganography.component';

describe('ImageSteganographyComponent', () => {
  let component: ImageSteganographyComponent;
  let fixture: ComponentFixture<ImageSteganographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageSteganographyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageSteganographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
