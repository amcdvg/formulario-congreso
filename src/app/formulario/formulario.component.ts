/*import { Component } from '@angular/core';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {
  questions: string[] = [
    '¿Cuáles son las debilidades de su sector?',
    '¿Cuáles son las oportunidades en su sector?',
    '¿Cuáles son las fortalezas de su sector?',
    '¿Cuáles son las amenazas en su sector?'
  ];
  currentQuestionIndex: number = 0;
  response: string = '';

  nextQuestion() {
    if (this.response) {
      console.log(`Respuesta a ${this.questions[this.currentQuestionIndex]}: ${this.response}`);
      this.response = ''; // Limpiar el input después de cada respuesta
      this.currentQuestionIndex++;
    }
  }
}*/

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {
  questions: string[] = [
    'Debilidades',
    'Oportunidades',
    'Fortalezas',
    'Amenazas'
  ];
  currentQuestionIndex: number = 0;
  response: string = '';
  formularioCompletado: boolean = false; // Nueva variable para indicar si el formulario está completo

  constructor(private http: HttpClient) {}

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length;
  }

  nextQuestion() {
    if (this.response) {
      const payload = {
        questionIndex: this.currentQuestionIndex,
        response: this.response
      };
      this.http.post('https://back-formulario-congreso.onrender.com/respuesta', payload).subscribe(() => {
        this.response = '';
        this.currentQuestionIndex++;
        if (this.isLastQuestion) {
          this.formularioCompletado = true; // Marcar el formulario como completo
        }
      });
    }
  }
}




