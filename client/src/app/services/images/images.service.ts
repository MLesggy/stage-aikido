import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '../../models/images/images.models';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private readonly apiURL = 'http://localhost:8000/api/images';
  private imageUrls = new Map<number, SafeUrl>();
  private blobCache = new Map<number, Blob>();

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  /* ==================== API METHODS ==================== */

  getImages(): Observable<Image[]> {
    return this.http.get<Image[]>(this.apiURL);
  }

  getSingleImage(id: number): Observable<Image> {
    return this.http.get<Image>(`${this.apiURL}/${id}`);
  }

  addImage(image: Image): Observable<Image> {
    return this.http.post<Image>(this.apiURL, image);
  }

  updateImage(image: Image): Observable<Image> {
    return this.http.put<Image>(`${this.apiURL}/${image.image_id}`, image);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${id}`);
  }

  /* ==================== IMAGE PROCESSING ==================== */

  /**
   * Process images for a list of entities
   * @param entities Array of entities
   * @param imageGetter Function to extract images from entity
   * @param options { clearCache: boolean }
   */
  processEntitiesImages<T>(
    entities: T[],
    imageGetter: (entity: T) => Image[] | undefined,
    options: { clearCache?: boolean } = {}
  ): void {
    if (options.clearCache) this.clearCache();
    if (!entities?.length) return;

    entities.forEach(entity => {
      const images = imageGetter(entity);
      images?.forEach(image => this.processImage(image));
    });
  }

  /**
   * Process a single image
   * @param image Image object to process
   */
  processImage(image: Image): void {
    if (!image?.image_id || !image.image_blob)return;

    // Skip if already processed
    if (this.imageUrls.has(image.image_id)) return;

    try {
      const blob = this.createBlob(image);
      const url = URL.createObjectURL(blob);

      this.blobCache.set(image.image_id, blob);
      this.imageUrls.set(image.image_id, this.sanitizer.bypassSecurityTrustUrl(url)
      );
    } catch (error) {
      alert(`Error processing image ${image.image_id}`);
    }
  }

  /* ==================== UTILITIES ==================== */

  getImageUrl(imageId: number): SafeUrl | undefined {
    return this.imageUrls.get(imageId);
  }

  hasImage(imageId: number): boolean {
    return this.imageUrls.has(imageId);
  }

  getOriginalBlob(imageId: number): Blob | undefined {
    return this.blobCache.get(imageId);
  }

  clearCache(): void {
    this.imageUrls.forEach(url => URL.revokeObjectURL(url.toString()));
    this.imageUrls.clear();
    this.blobCache.clear();
  }

  downloadImage(imageId: number, fileName: string = ''): void {
    const blob = this.getOriginalBlob(imageId);
    if (!blob) return;

    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName || `image-${imageId}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  private createBlob(image: Image): Blob {
    // Cas Blob natif
    if (image.image_blob instanceof Blob) {
      return image.image_blob;
    }

    // Cas ArrayBuffer
    if (image.image_blob instanceof ArrayBuffer) {
      return new Blob([image.image_blob], { type: image.image_type || 'image/jpeg' });
    }

    // Cas objet avec propriété data (format JSON)
    if ('data' in image.image_blob && Array.isArray(image.image_blob.data)) {
      const uintArray = new Uint8Array(image.image_blob.data);
      return new Blob([uintArray], { type: image.image_type || 'image/jpeg' });
    }

    // Fallback sécurisé
    alert('Format de blob non supporté');
    return new Blob([], { type: image.image_type || 'image/jpeg' });
  }

}
