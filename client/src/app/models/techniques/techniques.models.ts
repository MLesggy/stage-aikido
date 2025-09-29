export class Technique {
  technique_id: number = -1;
  technique_official: boolean = false;
  technique_move: string = '';
  technique_link: string = '';
  grade_id: number = -1; //1 à 6. 1=5eme kuy, 2=4eme kuy, 3=3eme kuy, 4=2eme kuy, 5=1er kuy, 6=buki waza
  work_form_id: number = -1; //1 à 4. 1=Tachi Waza, 2=Suwari Waza, 3=Hanmi Hantachi Waza, 4=Tanto dori
  attack_form_id: number = -1; //1 à X. 

  //includes
  grade_name : string = ''; // '5eme kuy', '4eme kuy' etc etc
  work_form_name : string = ''; // Tachi Waza, Suwari Waza etc etc
  attack_form_name : string = ''; // Kata Dori, Katate Dori, Sode Dori etc etc
  dan_grade_ids : number[] = []; // liste d'entier qui contient l'id des dan_grades associées à cette technique

  //extra
  technique_wonderfull_name: string = '';
}