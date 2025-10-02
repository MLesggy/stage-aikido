import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/authentication';
import { HomeService } from '../../services/home/home.service';
import { ImagesService } from '../../services/images/images.service';
import { HomeContent } from '../../models/home-contents/home-contents.models';
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
export class HomeComponent implements OnInit, AfterViewInit {
  content!: HomeContent[];
  currentContent: HomeContent = new HomeContent();

  slides = [
    { type: 'image', src: 'images/francki.jpg' },
    { type: 'image', src: 'images/2.jpg' }
  ];

  videos =[
    { type: 'video', src: 'images/budo1.mp4' }
  ]

  constructor(
    public authService: AuthService,
    public homeService: HomeService,
    public imagesService: ImagesService,
  ) { }

  ngOnInit(): void {
    this.getHomeData();
  }

  ngAfterViewInit() {
    this.tryPlayVideo();
  }

  private tryPlayVideo(attempts: number = 0, maxAttempts: number = 20) {
    const firstVideo = document.querySelector('#swiper-video video') as HTMLVideoElement;
    
    if (!firstVideo && attempts < maxAttempts) {
      setTimeout(() => this.tryPlayVideo(attempts + 1, maxAttempts), 100);
      return;
    }
    
    if (firstVideo) {
      firstVideo.muted = true;
      firstVideo.play().catch(() => {});
    }
  }

  onSlideChange(event: any) {
    const swiper = event.target.swiper;
    const videos = swiper.slides[swiper.activeIndex]?.querySelectorAll('video');
    
    videos?.forEach((video: HTMLVideoElement) => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  getHomeData() {
    this.homeService.getContent().subscribe((contentData: any) => {
      // Traitement du contenu
      if (Array.isArray(contentData)) {
        this.content = contentData.map(content => Object.assign(new HomeContent(), content));
      } else {
        this.content = [Object.assign(new HomeContent(), contentData)];
      }
    });
  }

}
