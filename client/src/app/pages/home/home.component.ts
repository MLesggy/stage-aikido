import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/authentication';
import { HomeService } from '../../services/home/home.service';
import { ImagesService } from '../../services/images/images.service';
import { HomeContent } from '../../models/home-contents/home-contents.models';
import { Image } from '../../models/images/images.models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register(); 

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

 slides = [
    { type: 'image', src: 'images/francki.jpg' },
    { type: 'image', src: 'images/2.jpg' }
    // { type: 'image', src: 'assets/images/slide3.jpg' }
  ];
  videos =[
 { type: 'video', src: 'images/budo1.mp4' }
  ]



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
