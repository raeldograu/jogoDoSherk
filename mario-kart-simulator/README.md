# 🏎️ Mario Kart Terminal Simulator

Simulador de corridas inspirado em Mario Kart, executado diretamente no terminal com Node.js.

## Como Jogar

### Requisitos
- Node.js 18+

### Iniciar o Jogo
```bash
cd mario-kart-simulator
npm start
```

## Funcionalidades

### 🎮 Personagens (8 jogaveis)
- **Mario** - Equilibrado em todos os atributos
- **Luigi** - Aceleracao superior
- **Peach** - Manuseio excelente nas curvas
- **Toad** - Pequeno e rapido na aceleracao
- **Bowser** - Velocidade maxima brutal
- **Donkey Kong** - Forte nas retas
- **Yoshi** - Agil e confiavel
- **Wario** - Velocidade insana, dificil de controlar

Cada personagem tem atributos unicos: **Velocidade**, **Aceleracao**, **Manuseio** e **Peso**.

### 🗺️ Pistas (5 disponveis)
- **Circuito de Mario** - Facil, ideal para iniciantes
- **Praia Koopa** - Cuidado com a areia!
- **Castelo do Bowser** - Lava e bolas de fogo!
- **Estrada Arco-Iris** - A mais temida, sem grades!
- **Fazenda Moo Moo** - Vacas na pista!

### 🎁 Itens Classicos
| Item | Efeito |
|------|--------|
| 🍌 Banana | Faz o adversario derrapar |
| 🟢 Casco Verde | Dispara em linha reta |
| 🔴 Casco Vermelho | Persegue o corredor a frente |
| 🍄 Cogumelo | Boost de velocidade |
| 🍄🍄🍄 Cogumelo Triplo | Tres boosts seguidos |
| ⭐ Estrela | Invencibilidade temporaria |
| ⚡ Raio | Encolhe todos os oponentes |
| 🔵 Casco Azul | Explode o 1o lugar |

O sistema de itens usa **rubber-banding**: jogadores em posicoes piores recebem itens mais poderosos!

### 🕹️ Acoes por Turno
1. **Acelerar** - Ganha velocidade baseada na aceleracao do personagem
2. **Drift** - Derrape para ganhar boost baseado no manuseio
3. **Usar Item** - Use o item coletado
4. **Defender** - Posicao defensiva

### 🏁 Sistema de Corrida
- Corrida por turnos com 3 voltas
- Competidores IA com comportamento dinamico
- Perigos na pista variam por dificuldade
- Barras de progresso visuais no terminal
- Efeitos de status (atordoado, boost, invencivel, encolhido)

## Estrutura do Projeto
```
mario-kart-simulator/
├── package.json
├── README.md
└── src/
    ├── index.js        # Menu principal e fluxo do jogo
    ├── characters.js   # Definicao dos personagens
    ├── tracks.js       # Pistas e perigos
    ├── items.js        # Sistema de itens
    └── race.js         # Motor da corrida
```
