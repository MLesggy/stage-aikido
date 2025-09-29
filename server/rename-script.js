// replace.js
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier que vous voulez modifier
const filePath = 'src/services/work-forms.services.js';

// Lire le contenu du fichier
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/techniquesModel/g, 'workFormsModel');
content = content.replace(/TechniquesService/g, 'WorkFormsService');
content = content.replace(/techniqueData/g, 'workFormsData');
content = content.replace(/techniques/g, 'workForms');
content = content.replace(/technique/g, 'workForm');
content = content.replace(/Techniques/g, 'WorkForms');
content = content.replace(/Technique/g, 'WorkForm');

// Écrire le contenu modifié dans le fichier
fs.writeFileSync(filePath, content);

console.log('Remplacements terminés !');