import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css'],
  standalone: true
})
export class ImageUploaderComponent {
  @Output() imageLoaded = new EventEmitter<HTMLImageElement>();

  onImageLoad(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          img.src = e.target.result as string;
          this.imageLoaded.emit(img);
        } else {
          console.error('Failed to load image');
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No file selected');
    }
  }

}
