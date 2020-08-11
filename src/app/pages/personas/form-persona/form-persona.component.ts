import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { SignaturePad, PointGroup } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-form-persona',
  templateUrl: './form-persona.component.html',
  styleUrls: ['./form-persona.component.scss']
})
export class FormPersonaComponent implements OnInit {

  @ViewChild ('signatureCanvas', {static: true}) signaturePad: SignaturePad;

  signaturePadOptions: Object = {
    'minWidth': 1.5,
    'canvasWidth': 1000,
    'canvasHeight': 200
  };

  @Input() persona = null;

  @Output() guardaPersona = new EventEmitter<any>();

  form: FormGroup;

  constructor(protected fb: FormBuilder) { }

  ngOnInit(): void {
    this.iniForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['persona'] && changes['persona'].isFirstChange() === false) {
      this.iniForm();
    }
  }

  iniForm(): void {
    this.form = this.fb.group({
      numero: [this.persona ? this.persona.numero : null],
      nombre: [this.persona ? this.persona.nombre : null, Validators.required],
      apellido1: [this.persona ? this.persona.apellido1 : null, Validators.required],
      apellido2: [this.persona ? this.persona.apellido2 : null, Validators.required]
    });

    if(this.persona && this.persona.firma){
      this.convertBlobPNGToBase64(this.persona.firma);
    }
  }

  guardar(): void{
    const scope = this;
    this.guardaPersona.emit(Object.assign({ firma: this.convertBase64ToBlobPNG()}, this.form.value));

    setTimeout(() => {
      scope.resetForm();
    }, 0);
  }

  /**
   * Resetea elementos del formulario a valores por defecto
   */
  resetForm(): void{
    this.form.reset();
    this.signaturePad.clear();
  }

  /**
   * Evalua si el formulario ya tiene la firma realizada
   */
  get noFirmado(): boolean{
    return this.signaturePad.toData().length == 0;
  }

  /**
   * Convierte de Base64 a Blob/PNG
   */
  convertBase64ToBlobPNG(): Blob {
    const dataURL = this.signaturePad.toDataURL('image/png');
    const data = atob(dataURL.substring('data:image/png;base64,'.length));
    const asArray = new Uint8Array(data.length);

    for (let i = 0, len = data.length; i < len; ++i) {
      asArray[i] = data.charCodeAt(i);
    }

    const blob = new Blob([asArray], { type: 'image/png' });
    return blob;
  }

  /**
   * Convierte de Blob/PNG a Base64
   * @param blob
   */
  convertBlobPNGToBase64(blob: Blob){
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    let base64data;
    const scope = this;

    reader.onloadend = function() {
        base64data = reader.result;
        scope.signaturePad.fromDataURL(base64data);
    };
  }
}
