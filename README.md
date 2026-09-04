# Era Só um Copo

Uma experiência digital interativa sobre álcool, escolhas, dependência e recuperação.

## Sobre

Em vez de apresentar o tema como uma lista de definições, a experiência acompanha o visitante por uma narrativa curta: o primeiro copo, o ciclo de alívio, as mudanças no cérebro, as escolhas e os impactos invisíveis. O final oferece caminhos de ajuda no Brasil, incluindo SUS, CAPS AD e SAMU.

O conteúdo é educativo. Uma frase ou escolha isolada não diagnostica dependência; avaliação e cuidado devem ser feitos por profissionais de saúde.

## Recursos

- SPA estática, sem instalação ou dependências de build
- Storytelling em 10 capítulos com transições
- Ciclo, cérebro, impactos, escolhas e quiz interativos
- Modo claro, opção de som preparada e progresso salvo localmente
- Navegação por teclado, foco visível e suporte a movimento reduzido
- Layout responsivo para celular e desktop
- Links oficiais para saúde pública e emergência

## Executar

Abra `index.html` no navegador. Para servir localmente, qualquer servidor estático funciona, por exemplo:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

```text
index.html   experiência e conteúdo
style.css    identidade visual e responsividade
script.js    estado narrativo e interações
```

## Fontes

As orientações de saúde pública apontam para materiais oficiais da Organização Mundial da Saúde e do Ministério da Saúde, disponíveis nos links exibidos na experiência.

## Licença

MIT
