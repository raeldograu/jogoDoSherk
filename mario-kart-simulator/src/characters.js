// Personagens inspirados no universo Mario Kart
// Cada personagem tem atributos que influenciam a corrida

const CHARACTERS = [
  {
    id: 1,
    name: "Mario",
    emoji: "\u{1F3CE}\uFE0F",
    speed: 7,
    acceleration: 7,
    handling: 7,
    weight: "Medio",
    description: "Equilibrado em tudo - o heroi classico!",
  },
  {
    id: 2,
    name: "Luigi",
    emoji: "\u{1F3CE}\uFE0F",
    speed: 7,
    acceleration: 8,
    handling: 6,
    weight: "Medio",
    description: "Aceleracao um pouco melhor que o irmao.",
  },
  {
    id: 3,
    name: "Peach",
    emoji: "\u{1F451}",
    speed: 6,
    acceleration: 8,
    handling: 9,
    weight: "Leve",
    description: "Manuseio excelente, perfeita nas curvas!",
  },
  {
    id: 4,
    name: "Toad",
    emoji: "\u{1F344}",
    speed: 5,
    acceleration: 9,
    handling: 8,
    weight: "Leve",
    description: "Pequeno e rapido na aceleracao!",
  },
  {
    id: 5,
    name: "Bowser",
    emoji: "\u{1F432}",
    speed: 9,
    acceleration: 4,
    handling: 5,
    weight: "Pesado",
    description: "Velocidade maxima brutal, mas demora a acelerar.",
  },
  {
    id: 6,
    name: "Donkey Kong",
    emoji: "\u{1F98D}",
    speed: 8,
    acceleration: 5,
    handling: 6,
    weight: "Pesado",
    description: "Forte e veloz, domina as retas!",
  },
  {
    id: 7,
    name: "Yoshi",
    emoji: "\u{1F438}",
    speed: 6,
    acceleration: 8,
    handling: 8,
    weight: "Medio",
    description: "Agil e confiavel, otimo para iniciantes!",
  },
  {
    id: 8,
    name: "Wario",
    emoji: "\u{1F608}",
    speed: 9,
    acceleration: 3,
    handling: 4,
    weight: "Pesado",
    description: "Velocidade maxima insana, mas dificil de controlar!",
  },
];

export function getCharacters() {
  return CHARACTERS;
}

export function getCharacterById(id) {
  return CHARACTERS.find((c) => c.id === id);
}

export function getRandomCharacter(excludeIds = []) {
  const available = CHARACTERS.filter((c) => !excludeIds.includes(c.id));
  return available[Math.floor(Math.random() * available.length)];
}
