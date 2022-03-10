import { tarefaService } from './../../services/tarefa.service';
import { Component } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  tarefaCollection : any[]=[];
  constructor(private alertCtrl: AlertController, private tarefaService : tarefaService, private acitionSheetCtrl : ActionSheetController) { }

  ionViewDidEnter(){
    this.listarTarefa();
  }

  listarTarefa(){
    this.tarefaCollection = this.tarefaService.listar();
  }

  async showAdd(){
    const alert = await this.alertCtrl.create({
      header: 'Informe a tarefa',
      inputs: [{
        name: 'tarefa',
        type: 'text',
        placeholder: 'Descreva sua tarefa'
      },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }

        }, {

          text: 'Salvar',
          handler: (tarefa) => {
            this.tarefaService.salvar(tarefa, () => {
              this.listarTarefa();
            })
          }
        }
      ]
    });

    await alert.present();
  }

  delete(item){
    this.tarefaService.delete(item, ()=>{
      this.listarTarefa();
    });
  }

  async openActions(tarefa: any){
    const actionSheet =await this.acitionSheetCtrl.create({
      header: "O QUE DESEJA FAZER?",
      buttons: [{
        text: tarefa.feito ? 'Colocar como pendente': 'Marcar como realizado',
        icon: tarefa.feito ? 'close-circle' : 'checkmark-circle',
        handler: () => {
          tarefa.feito = ! tarefa.feito;

          this.tarefaService.atualizar(tarefa, () => {
            this.listarTarefa();
          });

        }
      },{
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler:()=>{
          console.log('calcel clicked');
        }
      }
    ]

    });
    await actionSheet.present();
  }
}
