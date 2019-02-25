import { Negociacao } from './Negociacao'
import { MeuObjeto } from './interfaces/MeuObjeto';

export class Negociacoes implements MeuObjeto<Negociacoes> {

    //Array que irá guardar as negociações
    private _negociacoes: Negociacao[] = [];

    //#region Método para adicionar negociação ao array encapsulado
    adiciona(negociacao: Negociacao): void {

        this._negociacoes.push(negociacao);
    }
    //#endregion

    //#region Médoto para retornar a lista de negociações adicionadas ao array
    paraArray(): Negociacao[] {

       return ([] as Negociacao[]).concat(this._negociacoes);
    }
    //#endregion

    paraTexto(): void {
        console.log('-- paraTexto --');
        console.log(JSON.stringify(this._negociacoes));
    }

    ehIgual(negociacoes: Negociacoes): boolean{

        return JSON.stringify(this._negociacoes) == JSON.stringify(negociacoes.paraArray());
    }
}