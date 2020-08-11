import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lista-persona',
  templateUrl: './lista-persona.component.html',
  styleUrls: ['./lista-persona.component.scss']
})
export class ListaPersonaComponent implements OnInit {

  constructor(private http: HttpClient) { }

  /**
   * Datos de persona que se eesta editando
   */
  persona = null;


  listaPersonas = [
    {
      nombre: "Leonel",
      apellido1: "Messi",
      apellido2: "Mesin",
    },
    {
      nombre: "Cristiano",
      apellido1: "Ronaldo",
      apellido2: "Ronaldin"
    },
    {
      nombre: "Neymar",
      apellido1: "Junior",
      apellido2: "Junin"
    }
  ];

  ngOnInit(): void {
    this.initFirmFromFile();
  }

  onGuardaPersona(persona): void{
    if(persona.numero != null){
      this.listaPersonas[persona.numero] = persona;
    }
    else{
      persona['numero'] = this.listaPersonas.length;
      this.listaPersonas.push(persona);
    }
  }

  onPersonaClick(index, persona): void{
    this.persona = Object.assign({ numero: index }, persona);
  }

  /**
   * Carga firmas de los item por defecto
   */
  initFirmFromFile(): void{
    this.http.get('/assets/messi.png', { responseType: 'blob' }).subscribe(res => { this.listaPersonas[0]['firma'] = res; });
    this.http.get('/assets/cristiano.png', { responseType: 'blob' }).subscribe(res => { this.listaPersonas[1]['firma'] = res; });
    this.http.get('/assets/neymar.png', { responseType: 'blob' }).subscribe(res => { this.listaPersonas[2]['firma'] = res; });
  }
}
