import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/authentication';
import { HomeService } from '../../services/home/home.service';
import { ImagesService } from '../../services/images/images.service';
import { HomeContent } from '../../models/home-contents/home-contents.models';
import { Image } from '../../models/images/images.models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  content!: HomeContent[];
  image!: Image;
  currentContent: HomeContent = new HomeContent();
  sanitizedUrl!: SafeResourceUrl;

  constructor(
    public authService: AuthService,
    public homeService: HomeService,
    public imagesService: ImagesService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getHomeData();
  }

  getSafeUrl() {
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.content[0].home_data_video_url);
  }

  getHomeData() {
    this.homeService.getContent().subscribe((contentData: any) => {
      // Traitement du contenu
      if (Array.isArray(contentData)) {
        this.content = contentData.map(content => Object.assign(new HomeContent(), content));
      } else {
        this.content = [Object.assign(new HomeContent(), contentData)];
      }

      this.getSafeUrl(); // Appel synchronne OK

      // Chargement de l'image (asynchrone)
      if (this.content[0]?.image_id) {
        this.imagesService.getSingleImage(this.content[0].image_id).subscribe({
          next: (response: Image | Image[]) => {
            const imageData = Array.isArray(response) ? response[0] : response;
            
            if (imageData) {
              this.image = Object.assign(new Image(), imageData);
              this.imagesService.processImage(this.image); // On appelle processImage ICI
            }
          }
        });
      }
    });
  }

}
