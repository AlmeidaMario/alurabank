import { Negociacao, Negociacoes  } from '../models/index';
import { NegociacoesView, MensagemView } from '../views/index';
import { domInject, throttle } from '../helpers/decorators/index';
import { NegociacaoService, ResponseHandler } from '../services/index';
import { imprime } from '../helpers/index';


export class NegociacaoController {

    // Propriedades_Atributos da Classe Controladora

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;
    
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');
    private _service = new NegociacaoService();


    //Construtor da Classe controladora
    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }
    
    //#region Evento acionado pelo submit do Formulário HTML -> Linha 4 "APP.TS"
    @throttle()
    adiciona() {

        let data = new Date(this._inputData.val().replace(/-/g, ','));
        if(!this._ehDiaUtil(data)) {

            this._mensagemView.update('Somente negociações em dias úteis, por favor!');
            return 
        }

        //Criando e preenchendo Objeto do tipo NEGOCIACAO para adicionar ao Array através do método Adiciona da classe Negociacoes
        const negociacao = new Negociacao(
                                          data,
                                          parseInt( this._inputQuantidade.val()),
                                          parseFloat(this._inputValor.val()));

        //Passando o Objeto no parâmetro do método para o Array
        this._negociacoes.adiciona(negociacao);
        imprime(negociacao,this._negociacoes);//Console do navegador
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }
    //#endregion

    private _ehDiaUtil(data: Date) {

        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }

    @throttle()
    async importaDados()
    {
        //#region Antigo
        // this._service
        //     .obterNegociacoes(res => {

        //         if(res.ok) {
        //             return res;
        //         } else {
        //             throw new Error(res.statusText);
        //         }
        //     })
        //     .then(negociacoesParaImportar => {

        //         const negociacoesJaImportadas = this._negociacoes.paraArray();

        //         negociacoesParaImportar
        //             .filter(negociacao => 
        //                    !negociacoesJaImportadas.some(jaImportada => 
        //                                                  negociacao.ehIgual(jaImportada)))
        //                     .forEach(negociacao => 
        //                             this._negociacoes.adiciona(negociacao));

        //         this._negociacoesView.update(this._negociacoes);
        //     }).
        //     catch(err => {
        //         this._mensagemView.update(err.message);
        //     });
        //#endregion
        try {
            // usou await antes da chamada de this.service.obterNegociacoes()
             const negociacoesParaImportar = await this._service
                 .obterNegociacoes(res => {
 
                     if(res.ok) {
                         return res;
                     } else {
                         throw new Error(res.statusText);
                     }
                 });
 
             const negociacoesJaImportadas = this._negociacoes.paraArray();
 
             negociacoesParaImportar
                 .filter(negociacao => 
                     !negociacoesJaImportadas.some(jaImportada => 
                         negociacao.ehIgual(jaImportada)))
                 .forEach(negociacao => 
                 this._negociacoes.adiciona(negociacao));
 
             this._negociacoesView.update(this._negociacoes);
 
         } catch(err) {
             this._mensagemView.update(err.message);
         }
    
    }
}

    enum DiaDaSemana {
        Domingo,
        Segunda,
        Terca,
        Quarta, 
        Quinta, 
        Sexta, 
        Sabado
    }