# SEO dos produtos novos (30/10/2026)

Briefing para a sessão local, que tem acesso à API da E-Com Plus (store 51419).
Feito numa sessão na nuvem que não tinha acesso ao catálogo. A lista de produtos saiu
do histórico de `.ecomplus.cd.json` (cada produto salvo dispara um commit do robô).

## Regras combinadas com o Ivan

- **Antes de gravar qualquer coisa no catálogo, mostrar as mudanças propostas e esperar a aprovação.**
- Título até 60 caracteres, sem a marca, com as funcionalidades e os termos mais buscados no começo.
- Meta title até 60 caracteres e meta description até 155.
- Descrição completa sem formatação Markdown, em seções curtas: benefícios, ideal para,
  especificações técnicas, conteúdo da embalagem e cuidados de uso.
- Não inventar especificação. O que não estiver no cadastro ou não for confirmado pelo Ivan fica de fora,
  por exemplo horas de conservação térmica, material inox, capacidade máxima e "sem ferramentas".
- Landing `.lhx` (padrão do Ar-Condicionado Emmeti) só para os produtos principais, com as imagens em WebP
  em `template/public/img/uploads/<produto>/`. Os estilos e o JS do `.lhx` já existem no site.
- Trabalhar no branch `claude/inspiring-galileo-2uh0yf` (PR #87).

## Produtos salvos em 30/10, entre 14:10 e 14:22

### Já trabalhados na sessão da nuvem (os títulos combinados já estão nos slugs)

| Slug | O que já foi definido |
|---|---|
| `garrafa-termica-1l-cafe-e-cha-tampa-alavanca-antivazamento` | Título "Garrafa Térmica 1L Café e Chá Tampa Alavanca Antivazamento". Modelo XH4021, 1 L, preto piano, 25 cm x 14 cm, 650 g, tampa com alavanca e vedação em silicone, bico triangular. A conservação térmica em horas e o material não foram confirmados. |
| `guarda-sol-colorido-180m-praia-piscina-haste-aluminio-leve` | 1,80 m, haste de alumínio. **Não tem fator UV50+** (falar só em "protege do sol"). **Não vem com bolsa nem base.** A inclinação não foi confirmada. |
| `assento-sanitario-almofadado-colorido-oval-tampa-universal` | Tampa colorida e estampada (modelos XH2019 e outros). Assento e tampa almofadados, formato oval. As medidas 41 x 36 x 4,5 cm vieram de um anúncio de outro vendedor e **precisam ser confirmadas**. Incluir a frase "A estampa pode variar conforme o modelo escolhido no anúncio". |
| `assento-sanitario-almofadado-oval-com-tampa-universal-branco` | Mesmo produto na versão branca. Mesma ressalva sobre as medidas. |
| `kit-balanca-bioimpedancia-bluetooth-e-balanca-cozinha-10kg` | Bioimpedância: Bluetooth, app, 12 funções (peso, gordura corporal, IMC, massa muscular, água, proteína, gordura visceral, massa óssea, metabolismo basal, idade corporal, massa magra/LBM, grau de obesidade). Cozinha: SF-400, até 10 kg, precisão de 1 g, Tara, calibração automática, g/oz, desligamento automático ou manual, pilhas AA. Manter o aviso sobre gestantes e marca-passo. |

### Ainda não trabalhados

- `macarico-culinario-multiuso-portatil-com-bico-ceramico`
- `faca-chef-profissional-10-polegadas-aco-carbono-cabo-branco`
- `mini-multiprocessador-triturador-de-alimento-eletrico-250ml`
- `processador-de-alimentos-eletrico-1-2l-em-vidro-180w`
- `mixer-2-em-1-misturador-de-bebidas-eletrico-recarregavel`
- `abridor-de-vinho-eletrico-automatico-saca-rolha-recarregavel`
- `abridor-de-vinho-saca-rolha-eletrico-automatico-recarregavel`
- `bomba-para-galao-eletrica-recarregavel-usb-c-botao-on/off`
- `inflador-e-desinflador-eletrico-piscina-colchao-boia-127v`
- `inflador-e-desinflador-eletrico-piscina-colchao-boia-220v`
- `kit-50-abracadeira-alta-pressao-e-vedacao-metal-13mm-a-19mm`
- `kit-eixo-flexivel-extensor-360-universal-21-pecas`
- `calculadora-eletronica-de-mesa-8-digitos-teclas-de-acrilico`
- `domino-tipo-osso-28-pecas-pedra-grande-c/-estojo`
- `baralho-lavavel-6-jogos-nipe-grande-cartao-laminado`

## Problemas já encontrados

1. **Barra "/" no slug**, que quebra o endereço em pastas:
   - `domino-...-c/-estojo`: sugestão `domino-tipo-osso-28-pecas-pedra-grande-com-estojo`
   - `bomba-...-botao-on/off`: sugestão `bomba-para-galao-eletrica-recarregavel-usb-c-botao-liga-desliga`

   Ao trocar o slug, conferir se o endereço antigo fica redirecionado.
2. **Abridor de vinho duplicado** (dois slugs com as mesmas palavras em outra ordem). Confirmar com o Ivan se é o mesmo
   produto. Se for, manter um e desativar ou redirecionar o outro. Se não for, deixar a diferença clara no título.
3. **Inflador 127V e 220V em produtos separados.** Sugerir um produto só, com variação de voltagem.

## Ordem sugerida

1. Ler os 20 produtos na API (nome, slug, short_description, body_html, meta_title, meta_description, fotos).
2. Montar uma tabela com o diagnóstico de cada um e as mudanças propostas, e **pedir aprovação**.
3. Gravar o que for aprovado e, nos produtos principais, montar a landing `.lhx` com as imagens no git.
