import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service/authentication';
import { HomeService } from '../../services/home/home.service';
import { ImagesService } from '../../services/images/images.service';
import { HomeContent } from '../../models/home-contents/home-contents.models';
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
    { type: 'image', src: 'images/carousel/francki.jpg' },
    { type: 'image', src: 'images/carousel/3.jpg' },
    { type: 'image', src: 'images/carousel/4.jpg' },
    { type: 'image', src: 'images/carousel/5.jpg' },
    { type: 'image', src: 'images/carousel/7.jpg' },
    { type: 'image', src: 'images/carousel/8.jpg' }
  ];

  videos = [
    { type: 'video', src: 'videos/budo1.mp4' },
    { type: 'video', src: 'videos/budo2.mp4' },
    { type: 'video', src: 'videos/budo3.mp4' },
    { type: 'video', src: 'videos/budo4.mp4' },
    { type: 'video', src: 'videos/budo5.mp4' },
    { type: 'video', src: 'videos/budo7.mp4' },
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
    this.initVideoSwiper();
    this.initImageSwiper();
  }

  private initVideoSwiper() {
    const swiperEl = document.querySelector('#swiper-video') as any;
    if (!swiperEl) return;

    Object.assign(swiperEl, {
      slidesPerView: this.getSlidesPerView(),
      centeredSlides: true,
      spaceBetween: 30,
      navigation: true,
      pagination: true,
      loop: true
    });

    swiperEl.initialize();

    window.addEventListener('resize', () => {
      swiperEl.swiper.params.slidesPerView = this.getSlidesPerView();
      swiperEl.swiper.update();
    });

    swiperEl.swiper.on('slideChange', () => this.playActiveVideo(swiperEl));
    this.playActiveVideo(swiperEl);
  }

  private initImageSwiper() {
    const swiperImage = document.querySelector('#swiper-image') as any;
    if (!swiperImage) return;

    Object.assign(swiperImage, {
      navigation: true,
      pagination: true,
      loop: true
    });

    swiperImage.initialize();
  }

  private getSlidesPerView(): number {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1200) return 2;
    return 3;
  }

  private playActiveVideo(swiperEl: any) {
    const videos = document.querySelectorAll('#swiper-video video') as NodeListOf<HTMLVideoElement>;
    videos.forEach(v => {
      v.pause();
      v.currentTime = 5;
    });

    const activeSlide = swiperEl.swiper.slides[swiperEl.swiper.activeIndex];
    const activeVideo = activeSlide?.querySelector('video') as HTMLVideoElement;

    if (activeVideo) {
      activeVideo.muted = true;
      activeVideo.currentTime = 0;
      activeVideo.play();
    }
  }

  private tryPlayVideo(attempts: number = 0, maxAttempts: number = 20) {
    const firstVideo = document.querySelector('#swiper-video video') as HTMLVideoElement;

    if (!firstVideo && attempts < maxAttempts) {
      setTimeout(() => this.tryPlayVideo(attempts + 1, maxAttempts), 100);
      return;
    }

    if (firstVideo) {
      firstVideo.muted = true;
      firstVideo.play().catch(() => { });
    }
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
