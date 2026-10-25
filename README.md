# Convite de Ana Luisa Kolesny · 15 anos

Convite digital independente da TR Design. A capa preserva a imagem do castelo enviada pelo usuário. O botão **TOQUE PARA ENTRAR** é um `<button>` HTML visível com texto real; ele inicia o vídeo vertical fornecido. Ao fim dos 10 segundos, o convite principal aparece em uma transição suave.

A tela principal usa **uma única imagem vertical**, sem reconstrução dos elementos desenhados. No celular, a arte mantém sua proporção e preenche toda a altura da tela; apenas as bordas externas podem ser recortadas. No desktop, a imagem completa fica centralizada. Quatro números vivos e quatro áreas de clique acessíveis acompanham a escala da arte.

As páginas **Dress Code** e **Presentes** seguem o mesmo padrão com as imagens originais fornecidas: arte vertical ocupando toda a tela do celular e um botão HTML transparente, acessível por toque e teclado, alinhado à placa “Voltar ao convite”.

Os botões da capa, do convite e das páginas internas têm um brilho dourado suave e uma passagem lenta de luz. Toque, mouse e foco de teclado realçam a resposta; a preferência por movimento reduzido mantém o brilho sem animação.

## Abrir

Abra [`dist/index.html`](dist/index.html) no navegador ou sirva a pasta `dist`:

```powershell
python -m http.server 8765 --directory dist
```

Depois acesse `http://127.0.0.1:8765/`.

## Publicação

O site não exige etapa de compilação. `vercel.json` configura a pasta `dist` como saída estática; as prévias locais e os arquivos de configuração privada ficam fora do Git.

## Dados configuráveis

O nome do arquivo da arte principal está na constante `CONVITE_ART`, no início de [`dist/app.js`](dist/app.js). O objeto `evento` centraliza nome, data, telefone e endereço.

- A página de Presentes usa apenas a arte fornecida. A imagem menciona Pix, mas não informa uma chave nem exibe um comando para copiá-la.
- `musica` permanece `null`. Nenhum áudio adicional é carregado; o vídeo de entrada mantém seu próprio áudio.
- O prazo de confirmação é 08/11/2026 no horário de São Paulo. O link de WhatsApp continua disponível após a data, para que o organizador decida como lidar com confirmações tardias.
- O nome está desenhado nas três artes. Alterá-lo no objeto `evento` atualiza o título do navegador; trocar o nome nas telas exige novas imagens.

## Arquivos

- `dist/assets/referencia-capa.png`: cópia sem edição da capa fornecida.
- `dist/assets/entrada-castelo.mp4`: cópia sem edição do vídeo fornecido.
- `dist/assets/convite-ana-luisa.png`: arte principal com os quatro números estáticos removidos.
- `dist/assets/dress-code-ana-luisa.png`: cópia sem edição da imagem de Dress Code fornecida.
- `dist/assets/presentes-ana-luisa.png`: cópia sem edição da imagem de Presentes fornecida.
- `artwork/convite-ana-luisa-referencia.png`: imagem recebida, preservada para referência.
- `previews/`: capturas da capa, do vídeo e do convite principal.

## Verificação

- Botão da capa acionado por toque e tecla Enter; vídeo iniciado automaticamente, terminado após 10 segundos, transição para o convite; opção de pular e repetição ao voltar ao castelo.
- Contador calculado a partir de `2026-11-14T19:00:00-03:00`, atualizado a cada segundo, sobre os quatro círculos vazios.
- Quatro áreas de clique alinhadas à imagem. WhatsApp e Google Maps abrem em nova aba com links codificados; o mapa pesquisa diretamente o endereço informado. Dress Code e Presentes usam as páginas internas existentes.
- Acesso e retorno das páginas Dress Code e Presentes: comandos HTML reais, com nomes acessíveis e foco de teclado na página aberta.
- Arte preenchendo 100% da altura nas larguras de celular 320, 360, 375, 390, 414 e 430 px. Todos os quatro botões e números permaneceram visíveis, sem rolagem horizontal; no desktop, a arte completa permanece centralizada com rolagem vertical.
- Sem erros de console observados no navegador.

Os prompts usados para as artes geradas estão em [`ARTWORK.md`](ARTWORK.md).
