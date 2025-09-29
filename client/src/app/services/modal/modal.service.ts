import { Injectable, signal, computed, TemplateRef } from '@angular/core';

interface ModalData {
  title: string;
  content: TemplateRef<any>;
  context?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  // Pile de modales
  private modalStack = signal<ModalData[]>([]);
  
  // Signaux calculés
  isOpen = computed(() => this.modalStack().length > 0);
  isTopModal = computed(() => this.modalStack().length === 1);
  
  // Accès à la modale active
  title = computed(() => {
    const stack = this.modalStack();
    return stack.length ? stack[stack.length - 1].title : '';
  });
  
  content = computed(() => {
    const stack = this.modalStack();
    return stack.length ? stack[stack.length - 1].content : null;
  });
  
  context = computed(() => {
    const stack = this.modalStack();
    return stack.length ? stack[stack.length - 1].context || {} : {};
  });
  
  // Ajouter une modale à la pile
  open(title: string, content: TemplateRef<any>, context?: any) {
    this.modalStack.update(stack => [...stack, { title, content, context }]);
  }
  
  // Retirer la dernière modale
  close() {
    this.modalStack.update(stack => 
      stack.length ? stack.slice(0, -1) : stack
    );
  }

  // Retirer toutes les modale
  closeAll() {
    //vide le tableau et nettoie les anciennes valeurs de manière optimisée
    this.modalStack.set([]);
  }
}
