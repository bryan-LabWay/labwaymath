import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-current-curriculums',
  imports: [CommonModule],
  templateUrl: './current-curriculums.html',
  styleUrl: './current-curriculums.scss',
})
export class CurrentCurriculums {
  books = [
  { name: 'Math Mammoth',   src: 'assets/curriculums/mammoth.jpg' },
  { name: 'Horizons Math',  src: 'assets/curriculums/horizons.jpg' },
  { name: 'Math-U-See',     src: 'assets/curriculums/mathusee.jpg' },
  { name: 'Saxon Math',     src: 'assets/curriculums/saxon.jpg' },
  { name: 'Singapore Math', src: 'assets/curriculums/singapore.jpg' },
  { name: 'Life of Fred',   src: 'assets/curriculums/ctcmath.jpg' },
  { name: 'AoPS / others',  src: 'assets/curriculums/teachingTextbooks.jpg' }
];
}
