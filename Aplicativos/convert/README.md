# Conversão entre bases binário, decimal e hexa

Usando Javascript

Usei este gist

https://gist.github.com/faisalman/4213592

E achei que ficou um bom exemplo em Javascript e útil.

## Matemática das bases numéricas citadas

Aproveitarei para matar um pouco da saudade dos tempos em que fui professor de matemática e para preparar algo que venha a servir também para um dos meus filhos, que está fazendo Segurança da Informação e para o qual passei algumas informações sobre numeração binária.

## Bases de numeração

Exsitem várias e aqui abordarei a decimal (mais comum em nossa sociedade), a binária e a hexadecimal, que são comuns na programação e em especial na arquitetura dos microprocessadores. Dentro dos processadores basicamente existem pulsos elétricos de 0 e 5 volts, que são traduzidos por 0 e 1 binários. Impressionante que com apenas isso se representa tudo que um computador pode fazer por nós. Admirável.

## Números e algarismos

Já que estamos usando uma linguagem culta, que se usa nas escolas e faculdades, então é importante usar os termos adequados para o que queremos dizer

### Números

É um termo genérico, inclusive usado para dizer algarismos. Usamos sem distinção. Detalhes abaixo.

### Algarismos

No caso da nuemração decimal, os algarismos são 0, 1, 2, ... 9. De 0 a 9. São os componentes de um número. Números pequenos, de 0 a 9 se confundem com algarismos. Mas 10, 11 em diante são números e não algarismos. O 10 é um número formado por dois algarismos, o 0 e o 1.

Temos o número 1367, formado por 4 algarismos, que são 1, 3, 6 e 7. Acho que ficou claro.

Mas se tiver sobrado alguma dúvida pode me perguntar. Para isso crie um Issue, que o Github me mande um e-mail e te respondo. Talvez ajude também outros colegas com a mesma dúvida. Hoje isso é simples para mim mas lembro que nem sempre foi, ok?

### Decimais

São os mais comuns e que usamos em nosso dia. Seu nome vem dos algarismos usados, que são do 0 ao 9, ou seja, 10.

0, 1, 2, 3, 4, 5, 6, 7, 8, 9

Não preciso explicar as 4 oeprações som os decimais, pois são muito comuns e muito conhecidas.

### Soma

18
25
--
43

5 + 8 = 13. Escrevo o 3 e o 1 será somado com a próxima parcela:
2 + 1 + 1 (Este último 1 veio da anterior)

As demais você já sabe, acredito.

### Binários

Os bin ários me parece que foram criados para a eletrônica (não pesquisei) e muito utilizado nos computadores que vieram partindo da eletrônica.

Os algarismos binários são o 0 e o 1.

0 1

## Convertendo binário para decimal

Binário - 10
Decimal - 2 (veja detalhes abaixo)

Como?

Se tenho um número binário assim:

abcd

Para converter para decimal faço o seguinte:

Como são 4 dígitos eles tem as potẽncias de 0 a 3 da esquerda para a direita. O d tem potência 0. O c tem potência 1. O b tem potência 2 e o a tem potência 3.

Serão potências de 2, do binário.

Exemplo

Binário

101

Para decimal fazemos: 
- o primeiro vezes 2 elevado a 2 (pois é o terceiro da direita para a esquerda e começa com zero)
- somamos com o segundo vezes 2 elevado a 1
- somamos com o terceiro vezes 2 elevado a 0 (pois é o primeiro)

1*2^2 + 0*2^1 + 1*2^0 = 1*4 + 0*2 + 1*1 = 4 + 0 + 1 = 5 (lembre que primeiro resolvemos as potências, depois as multiplicações e finalmente as somas)

Podemos usar o pequeno conversos em JS para ver se nosso resultado está certo:

https://ribamar.net.br/convert/

Eu havia errado aqui (1*2^0, fiz 0, mas 2⁰0 vale 1 e vezes 1 = 1)

### Outro exemplo

Binário

10

Decimal

1*2^1 + 0*2^0 = 1*2 + 0*0 = 2 + 0 = 2

Podemos conferir no conversos.

Alguns binários e os decimais correspondentes

Binário Decimal
```
0       0
1       1
10      2
11      3
101     5
111     7
```

## Operações

### Soma

10 + 11

10
11
--
101 (Primeira parcela: 1 + 0 = 1. Segunda: 1 + 1 = 1 e vai 1 para a próxima)

## Hexadecimais

Os hexadecimais, também chamados de hexa tem 16 algarismos, que vão de 0 a F. Como assim? Então, como os algarismos da base 10 vão apenas de 0 a 9, o ser humano, inteligentemente usa letras para completar os 16. Então na base 16 temos os algarismos de 0 a 9 e mais A a F:

0, 1, 2, 3, 4, 5, 6. 7, 8, 9, A, B, C, D, E, F

Convenciona-se escrever em maiúsculas, mas podemos escrever também em minúsculas.

## Identificando as bases

E se eu escrever o número 11. Pergunto: é decimal ou binário. Também por default aceita-se tanto na sociedade quanto na programação, que o número é decimal. Então para escrever um número na base 10 não precisamos identificá-lo. Mas para evitar confusão se usa identificadores nas bases

Hexadecimal - identificado com o prefixo 0x. Então o número 1A, deve ser escrito como 0x1A

Gostaria de completar este pequeno guia, mas o deixarei inacabado. Até fiz uma pergunta num grande grupo (Clube de Programadores) se alguém lembrava como representar as várias bases na programação. Quando eu descobrir eu anoto aqui. Se você souber, por favor, me manda um Issue

https://github.com/ribafs/convert/issues

Que complementarei com o devido crédito.

## Observação

Queria mostrar estas informações e para mim está bom. Daqui pra frente é com você. Caso tenha mais dúvida sobre estes sistemas de nuemração com certeza será bem fácil encotrnar bom material sobre o assunto. Em seus estudos se sobrar alguma dúvida e quizer compartilhar comigo fique a votnade para criar um Issue.


=======
A versão/release 1.0 usa Javascript puro.

Esta versão usa as modais do bootbox .

http://bootboxjs.com/


## Referências

No site abaixo encontramos diversas bases numéricas

https://www.mathsisfun.com/numbers/bases.html

Outros bons sites

https://www.circuitcrush.com/hexadecimal-numbers-tutorial/

https://www.engineeringtoolbox.com/binary-octal-hexadecimal-numbers-d_1802.html


