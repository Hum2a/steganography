import { Component, Input, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-image-steganography',
  templateUrl: './image-steganography.component.html',
  styleUrls: ['./image-steganography.component.css'],
  standalone: true
})
export class ImageSteganographyComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  @Input() coverImage!: HTMLImageElement;
  @Input() secretImage!: HTMLImageElement;
  @ViewChild('stegoCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize your canvas and context here
      this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
      // Additional browser-only initialization
    }
  }

  encodeImage(): void {
    if (!this.coverImage || !this.secretImage) return;
    this.prepareCanvas(this.coverImage);
    const coverImgData = this.ctx.getImageData(0, 0, this.coverImage.width, this.coverImage.height);
    this.ctx.drawImage(this.secretImage, 0, 0, this.coverImage.width, this.coverImage.height);
    const secretImgData = this.ctx.getImageData(0, 0, this.coverImage.width, this.coverImage.height);

    const data = this.encodePixels(coverImgData.data, secretImgData.data);
    this.ctx.putImageData(new ImageData(data, this.coverImage.width, this.coverImage.height), 0, 0);
  }

  decodeImage(): void {
    this.prepareCanvas(this.coverImage); // Assuming the encoded image is now the "cover" image
    const imageData = this.ctx.getImageData(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    const data = this.decodePixels(imageData.data);
    this.ctx.putImageData(new ImageData(data, this.coverImage.width, this.coverImage.height), 0, 0);
  }

  saveImage(): void {
    const canvas = this.canvasRef.nativeElement;
    const image = canvas.toDataURL(); // Convert canvas to base64 data URL
    const link = document.createElement('a');
    link.href = image;
    link.download = 'stego_image.png'; // Set the download filename
    link.click(); // Trigger the download
  }

  private encodePixels(coverData: Uint8ClampedArray, secretData: Uint8ClampedArray): Uint8ClampedArray {
    const encodedData = new Uint8ClampedArray(coverData.length);
    for (let i = 0; i < coverData.length; i += 4) {
      // Encode each color channel
      for (let j = 0; j < 3; j++) {
        // Zero out the least significant bit and add the secret image's bit
        encodedData[i + j] = (coverData[i + j] & 0xFE) | ((secretData[i + j] & 0x80) >> 7);
      }
      encodedData[i + 3] = 255; // full alpha for the output
    }
    return encodedData;
  }

  private decodePixels(encodedData: Uint8ClampedArray): Uint8ClampedArray {
    const decodedData = new Uint8ClampedArray(encodedData.length);
    for (let i = 0; i < encodedData.length; i += 4) {
      // Decode each color channel
      for (let j = 0; j < 3; j++) {
        // Shift back the bits to their original position
        decodedData[i + j] = (encodedData[i + j] & 0x01) << 7;
      }
      decodedData[i + 3] = 255; // full alpha for the output
    }
    return decodedData;
  }

  private prepareCanvas(image: HTMLImageElement): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // Calculate the scaling factor to fit the image within the canvas
    const scaleFactor = Math.min(canvas.width / image.width, canvas.height / image.height);
    const scaledWidth = image.width * scaleFactor;
    const scaledHeight = image.height * scaleFactor;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the image centered within the canvas
    const offsetX = (canvas.width - scaledWidth) / 2;
    const offsetY = (canvas.height - scaledHeight) / 2;
    ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight);
  }

}
