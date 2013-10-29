$(function(){


	// variaveis de inicializacao
	var 
		// simbolo do jogador1
		jogador1      = 'X',

		// simbolo do jogador2
		jogador2      = 'O',

		// define jogador que começará a partida
		jogador       = jogador1

		vencedor      = false,
		
		// variavel para evitar a busca em todo o DOM sempre que precisar buscar um elemento de dentro do jogo
		tabuleiro     = $('.tabuleiro table'),

		// variavel criada para evitar muitos "tabuleiro.find('td')"
		casas         = tabuleiro.find('td')
		;



	var urlParams = $.unserialize(window.location.search);
	if(typeof urlParams.computerStart != 'undefined' && urlParams.computerStart == 1){
		jogador = jogador2;
	}

	//identificando as casas e adicionando ao atributo rel
	casas.each(function(i){
		$(this).attr('rel',i+1);
	})

	// array com as jogadas do oponente(usuario) e a do programa(computador)
	var
	jogadasOponente = new Array(),
	jogadasComp     = new Array()
	;

	// array com todas as combinações vitoriosas possiveis
	var combinacoesVitoriosas = [
		//horizontais
		[1,2,3],
		[4,5,6],
		[7,8,9],

		//verticais
		[1,4,7],
		[2,5,8],
		[3,6,9],

		//diagonais
		[1,5,9],
		[3,5,7]
		]

	// implementando a usabilidade do programa
	casas.find('a').click(function(){
		if(jogador == jogador2){
			alert('É a vez do Jogador 2 de jogar');
		}else{
			// registrando as jogadas do jogador usuario
			jogadasOponente.push(parseInt($(this).parent().attr('rel')));

			// adicionando o simbolo à casa e removendo o clique
			$(this).parent().text(jogador).end().remove();

			verificaVencedor(jogador);

			jogador = jogador2;

			// caso dê velha, computador não joga
			if(casas.find('a').length > 0){
				joga();
			}
		}
	})

	var
	// função que verifica se há vencedor ou não varrendo todas as combinações possiveis, remove todas as opções de clique informando o vencedor, caso haja .
		verificaVencedor = function(jogadorAtual){
			//return;
			todasCombinacoes:
			for(i in combinacoesVitoriosas){
				combinacao = combinacoesVitoriosas[i];
				if(ehVencedor(combinacao, jogadorAtual)){
					vencedor = jogadorAtual;
					casas.find('a').remove();
					alert('O jogador ' + vencedor + ' é o vencedor');
					break todasCombinacoes;
				}

			}
		},
		// auxilia a função ehVencedor, para facilitar a legibilidade do codigo
		ehVencedor = function(combinacao, jogadorAtual){
			estaVencendo = true;

			for(i in combinacao){
				if(casas.eq((combinacao[i]-1)).text() != jogadorAtual){
					estaVencendo = false;
					break;
				}
			}
			return estaVencendo;
		},
		// função que realiza a jogada do computador
		joga = function(){
			if(jogador == jogador2){
				// verifica se o usuario ja realizou ao menos uma jogada
				if(jogadasOponente.length > 0) {

					var
						possibilidadesOponente       = jogadasPossiveis(jogadasOponente,jogadasComp),
						casasDaPossibilidadeMarcadas = 0,
						casaParaMarcar               = 0;
					;

					possibilidades:
					for(i in possibilidadesOponente){
						var possibilidade = possibilidadesOponente[i];

						//zera as casas marcadas a cada nova combinacao vitoriosa possivel
						casasDaPossibilidadeMarcadas = 0;

						//varre as cadas e verifica qual foi marcada ou nao
						for(n in possibilidade){
							var casaPosibilidade = possibilidade[n];

							if($.inArray(casaPosibilidade,jogadasOponente) != -1){
								casasDaPossibilidadeMarcadas++;
							} else {
								casaParaMarcar = casaPosibilidade;
							}

						}

						if(casasDaPossibilidadeMarcadas == 2){
							break possibilidades;
						}

						//break;

					}

					var 
						minhasPossibilidades              = jogadasPossiveis(jogadasComp,jogadasOponente),
						casasDaMinhaPossibilidadeMarcadas = 0,
						casaMinhaParaMarcar               = 0;
					;

					minhasPossibilidades:
					for(i in minhasPossibilidades){
						var possibilidade = minhasPossibilidades[i];

						//zera as casas marcadas a cada nova combinacao vitoriosa possivel
						casasDaMinhaPossibilidadeMarcadas = 0;

						for(n in possibilidade){
							var casaPosibilidade = possibilidade[n];

							if($.inArray(casaPosibilidade,jogadasComp) != -1){
								casasDaMinhaPossibilidadeMarcadas++;
							} else {
								casaMinhaParaMarcar = casaPosibilidade;
							}

						}

						if(casasDaMinhaPossibilidadeMarcadas == 2){
							break minhasPossibilidades;
						}
					}

					if(casasDaMinhaPossibilidadeMarcadas == 2){ // se houver uma combinação que falte apenas umas casa, joga nela e vence
						casas.eq(casaMinhaParaMarcar - 1).text(jogador).find('a').remove();
						jogadasComp.push(casaMinhaParaMarcar);
					} else if(casasDaPossibilidadeMarcadas == 2){// se nao tiver como ganhar, bloqueia o adversario de uma opção de vencer
						casas.eq(casaParaMarcar - 1).text(jogador).find('a').remove();
						jogadasComp.push(casaParaMarcar);
					} else {
						var casa = casas.eq(4);
						if(casa.text() != jogador1 && casa.text() != jogador2){
							casa.text(jogador).find('a').remove();
							jogadasComp.push(5);
						} else {

								var melhoresJogadas;
								if(jogadasComp.length != 1 || $.inArray(5,jogadasOponente) != -1){
									melhoresJogadas = new Array(1,3,7,9);
								} else {
									melhoresJogadas = new Array(2,4,6,8);
								}

								var
									randomIndex = randomNum(melhoresJogadas.length),
									jogada = melhoresJogadas[randomIndex],
									casasLivres = casas.find('a');
								;
								// verifica se a casa ainda nao foi jogada
								while((casas.eq(jogada - 1).text() == jogador1 || casas.eq(jogada - 1).text() == jogador2) && casasLivres.length > 1){
									melhoresJogadas.splice(randomIndex,1);
									randomIndex = randomNum(melhoresJogadas.length);
									jogada = melhoresJogadas[randomIndex];
								}

								if(casasLivres.length == 1){
									jogada = parseInt(casasLivres.first().parent().attr('rel'));
								}

								casas.eq(jogada - 1).text(jogador).find('a').remove();
								jogadasComp.push(jogada);
							;
						}
					}

				} else {
					var
						impares = new Array(1,3,7,9),
						jogada = impares[randomNum(impares.length)]
					;

					casas.eq(jogada - 1).text(jogador).find('a').remove();
					jogadasComp.push(jogada);
				}
				verificaVencedor(jogador);
				jogador = jogador1;
			}
		},
		// função que verifica as jogadas possiveis do jogador, e verifica com as do adversario
		jogadasPossiveis = function(jogadas,jogadasAdversario){
			if(jogadas.length == 0) new Array();
			var possibilidades = new Array();
			for(i in combinacoesVitoriosas){
				var combinacao = combinacoesVitoriosas[i];
				var ultimaJogada = jogadas[jogadas.length-1];
				if($.inArray(parseInt(ultimaJogada), combinacao) != -1){
					if(!coincideJogada(combinacao, jogadasAdversario)){
						possibilidades.push(combinacao);
					}
				}
			}

			return possibilidades;
		},
		// verifica se as possiveis jogadas vitoriosas não foram interceptadas pelas jogas do oponente
		coincideJogada = function(combinacao, jogadas){
			if(jogadas.length == 0) return false;
			var coincide = false;

			for(i in jogadas){
				var jogada = jogadas[i];
				if($.inArray(parseInt(jogada), combinacao) != -1){
					coincide = true;
					break;
				}
			}

			return coincide;
		}

	// se o computador começa a jogar, chama a função responsavel
	if(jogador == jogador2){
		joga();
	}

})

//retorna um numero aleatorio
randomNum = function(max){
	return (Math.floor(Math.random() * max));
}