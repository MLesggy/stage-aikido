import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/authentication';
import { HomeContent } from '../../models/home-contents/home-contents.models';
import { EditHomeService } from '../../services/edit-home/edit-home.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagesService } from '../../services/images/images.service';
import { Image } from '../../models/images/images.models';
import { TemplateRef, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal/modal.service';
import { ModalComponent } from '../../components/modal/modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-home',
  imports: [CommonModule, ReactiveFormsModule, ModalComponent, MatButtonModule],
  templateUrl: './edit-home.component.html',
  styleUrl: './edit-home.component.css',
})
export class EditHomeComponent implements OnInit {
  content!: HomeContent[];
  editHome!: FormGroup;
  newContent!: HomeContent;
  images!: Image[];
  currentContent: HomeContent = new HomeContent();

  constructor(
    public authService: AuthService,
    public editHomeService: EditHomeService,
    private formBuilder: FormBuilder,
    private imageService: ImagesService,
    public modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.hydratation();
    this.initForm();
  }

  hydratation() {
    this.getHomeData();
    this.getImages();
  }

  getHomeData() {
    this.editHomeService.getContent().subscribe((contentData: any) => {
      if (Array.isArray(contentData)) {
        this.content = contentData.map((contentData: any) => {
          return Object.assign(new HomeContent(), contentData);
        });
      } else {
        this.content = [Object.assign(new HomeContent(), contentData)];
      }
      this.getContent();
    });
  }

  getImages() {
    this.imageService.getImages().subscribe((imagesData: any) => {
      if (Array.isArray(imagesData)) {
        // all Objects
        this.images = imagesData.map((singleImageData: any) => {
          return Object.assign(new Image(), singleImageData);
        });
      } else {
        //single object
        this.images = [Object.assign(new Image(), imagesData)];
      }
      //console.log(this.images);
    });
  }

  initForm() {
    this.editHome = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      image: ['', Validators.required],
      video: ['', Validators.required],
    });
  }

  // Chargement avec instanciation
  getContent() {
    this.editHome.get('id')?.setValue(this.content[0].home_data_id);
    this.editHome.get('title')?.setValue(this.content[0].home_data_title);
    this.editHome.get('subtitle')?.setValue(this.content[0].home_data_subtitle);
    this.editHome.get('image')?.setValue(this.content[0].image_id);
    this.editHome.get('video')?.setValue(this.content[0].home_data_video_url);
  }

  onSubmit() {
    if (this.content != null) {
      this.newContent = {
        home_data_id: this.editHome.get('id')?.value,
        home_data_title: this.editHome.get('title')?.value,
        home_data_subtitle: this.editHome.get('subtitle')?.value,
        image_id: this.editHome.get('image')?.value,
        home_data_video_url: this.editHome.get('video')?.value,
      };
      this.editHomeService.updateContent(this.newContent).subscribe({
        next: (newContent) => {
          //console.log(newContent);
        },
        error: () => {
          alert('Erreur lors de la modification');
        },
      });
    }
  }

  //PARTIE IMAGE
  // Ref of the template
  @ViewChild('imageFormTemplate') imageFormTemplate!: TemplateRef<any>;
  imageForm!: FormGroup;
  currentImage: Image = new Image();
  selectedFileName: string = '';

  initImageForm(): void {
    this.imageForm = this.formBuilder.group({
      image_id: [{ value: this.currentContent.image_id ?? -1, disabled: true }],
      image_description: [''],
      image_blob: ['', Validators.required],
    });
  }

  // Open the image form with given seminarId or -1 if we dont provide anything
  openImageModal() {
    this.initImageForm(); //reseting the form
    this.modalService.open('Ajouter une image', this.imageFormTemplate);
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;

      // Lire le fichier et le convertir en base64
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1]; // Enlever le préfixe pour n'avoir que le base64

        // Mettre à jour les autres champs du formulaire
        this.imageForm.patchValue({
          image_name: file.name,
          image_blob: base64String, // Stocker la chaîne en base64
        });

        // Définir currentImage à partir du fichier
        this.currentImage = new Image();
        this.currentImage.image_id = this.currentContent.image_id; //seminarId ou ClubId au besoin
        this.currentImage.image_name = file.name;
        this.currentImage.image_size = file.size;
        this.currentImage.image_type = file.type;
        this.currentImage.image_blob = base64String; // Stocker la chaîne en base64
        this.currentImage.image_description =
        this.imageForm.value.image_description;

        //console.log('Image courante mise à jour:', this.currentImage);
      };

      // Lancer la lecture du fichier en tant que Data URL (base64)
      reader.readAsDataURL(file);
    }
  }

  // Checking if are updating an image or if we are creating a new image
  onImageSubmit() {
    if (this.imageForm.invalid) {
      return; //invalid data in input
    } else {
      this.addImage(); //adding image to db
    }
  }

  addImage() {
    this.imageService.addImage(this.currentImage).subscribe({
      next: (newImage) => {
        // adding images to local copy
        this.images.push(newImage);
        this.modalService.close();
      },
      error: () => {
        alert("Erreur lors de l'ajout de l'image");
      },
    });
  }
}
