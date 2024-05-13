import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-in-image-steganography',
  templateUrl: './text-in-image-steganography.component.html',
  styleUrls: ['./text-in-image-steganography.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class TextInImageSteganographyComponent {
  @Input() image!: HTMLImageElement; // Using the definite assignment assertion
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>; // Same here
  private ctx!: CanvasRenderingContext2D;
  message: string = '';
  decodedMessage: string = '';

  ngAfterViewInit() {
    const context = this.canvas.nativeElement.getContext('2d');
    if (!context) {
      throw new Error('2D context not available');
    }
    this.ctx = context;
  }


  encodeText(): void {
    if (!this.image) return;
    const imgData = this.getImageData(this.image);
    const binaryMessage = this.stringToBinary(this.message + String.fromCharCode(0)); // Append NULL character for termination
    let dataIndex = 0;

    for (let i = 0; i < binaryMessage.length && dataIndex < imgData.data.length; i += 8) {
      const byte = binaryMessage.slice(i, i + 8);
      for (let j = 0; j < 8; j++) {
        if (dataIndex >= imgData.data.length) break;
        imgData.data[dataIndex] = (imgData.data[dataIndex] & ~1) | parseInt(byte[j], 2); // Set the LSB
        dataIndex += 4; // Move to the next pixel component (RGBA)
      }
    }
    this.ctx.putImageData(imgData, 0, 0);
  }

  decodeText(): void {
    const imgData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    let binaryMessage = '';
    for (let i = 0; i < imgData.data.length; i += 4) {
      const lsb = imgData.data[i] & 1;
      binaryMessage += lsb.toString();
    }
    this.decodedMessage = this.binaryToString(binaryMessage);
  }

  private getImageData(image: HTMLImageElement): ImageData {
    this.canvas.nativeElement.width = image.width;
    this.canvas.nativeElement.height = image.height;
    this.ctx.drawImage(image, 0, 0);
    return this.ctx.getImageData(0, 0, image.width, image.height);
  }

  private stringToBinary(str: string): string {
    return str.split('').map(char =>
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
  }

  private binaryToString(binary: string): string {
    let text = '';
    for (let i = 0; i < binary.length - 8; i += 8) {
      const byte = binary.slice(i, i + 8);
      const charCode = parseInt(byte, 2);
      if (charCode === 0) break; // Stop at NULL character
      text += String.fromCharCode(charCode);
    }
    return text;
  }
}
