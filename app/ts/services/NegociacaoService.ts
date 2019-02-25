import { NegociacaoParcial, Negociacao, Negociacoes } from '../models/index';
import { ResponseHandler } from '../services/index';

export class NegociacaoService {

    // :Promise<Negociacao[]>
    obterNegociacoes(handler: ResponseHandler): Promise<Negociacao[]> 
    {

        return fetch('http://localhost:8080/dados')
            .then(res => handler(res))
            .then(res => res.json())
            .then((dados: NegociacaoParcial[]) => 
                    dados
                    .map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
        )
        .catch(err => {
            console.log(err);
            throw new Error('Não foi possível obter dados da API!');
        });


    }
}