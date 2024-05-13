import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextInImageSteganographyComponent } from './text-in-image-steganography.component';

describe('TextInImageSteganographyComponent', () => {
  let component: TextInImageSteganographyComponent;
  let fixture: ComponentFixture<TextInImageSteganographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextInImageSteganographyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextInImageSteganographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
