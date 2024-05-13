import { Component, Input } from '@angular/core';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { ImageSteganographyComponent } from './image-steganography/image-steganography.component';
import { TextInImageSteganographyComponent } from "./text-in-image-steganography/text-in-image-steganography.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [ImageUploaderComponent, ImageSteganographyComponent, TextInImageSteganographyComponent]
})
export class AppComponent {
  @Input() coverImage!: HTMLImageElement;
  @Input() secretImage!: HTMLImageElement;


  onCoverImageLoaded(img: HTMLImageElement): void {
    this.coverImage = img;
  }

  onSecretImageLoaded(img: HTMLImageElement): void {
    this.secretImage = img;
  }
}
