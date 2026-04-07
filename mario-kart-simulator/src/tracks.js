// Pistas inspiradas no universo Mario Kart

const TRACKS = [
  {
    id: 1,
    name: "Circuito de Mario",
    emoji: "\u{1F3DF}\uFE0F",
    laps: 3,
    length: 100,
    difficulty: "Facil",
    description: "O circuito classico! Poucas curvas, otimo para iniciantes.",
    hazards: ["curva_leve"],
    itemBoxFrequency: 0.4,
  },
  {
    id: 2,
    name: "Praia Koopa",
    emoji: "\u{1F3D6}\uFE0F",
    laps: 3,
    length: 120,
    difficulty: "Facil",
    description: "Corrida na beira da praia com areia que desacelera!",
    hazards: ["areia", "curva_leve"],
    itemBoxFrequency: 0.35,
  },
  {
    id: 3,
    name: "Castelo do Bowser",
    emoji: "\u{1F3F0}",
    laps: 3,
    length: 150,
    difficulty: "Dificil",
    description: "Bolas de fogo, lava e curvas apertadas! Perigo total!",
    hazards: ["lava", "bola_de_fogo", "curva_apertada"],
    itemBoxFrequency: 0.5,
  },
  {
    id: 4,
    name: "Estrada Arco-Iris",
    emoji: "\u{1F308}",
    laps: 3,
    length: 180,
    difficulty: "Extremo",
    description: "A pista mais temida! Sem grades, curvas mortais no espaco!",
    hazards: ["sem_grade", "curva_apertada", "boost_zone"],
    itemBoxFrequency: 0.45,
  },
  {
    id: 5,
    name: "Fazenda Moo Moo",
    emoji: "\u{1F404}",
    laps: 3,
    length: 90,
    difficulty: "Facil",
    description: "Uma fazenda tranquila... cuidado com as vacas na pista!",
    hazards: ["vaca", "curva_leve"],
    itemBoxFrequency: 0.3,
  },
];

export function getTracks() {
  return TRACKS;
}

export function getTrackById(id) {
  return TRACKS.find((t) => t.id === id);
}

export function applyHazard(racer, hazard) {
  const messages = [];
  const chance = Math.random();

  switch (hazard) {
    case "curva_leve":
      if (chance > 0.7 + racer.character.handling * 0.03) {
        racer.speedModifier -= 1;
        messages.push(
          `  \u26A0\uFE0F ${racer.name} perdeu velocidade na curva!`
        );
      }
      break;

    case "curva_apertada":
      if (chance > 0.5 + racer.character.handling * 0.04) {
        racer.speedModifier -= 2;
        racer.stunned = 1;
        messages.push(
          `  \u{1F4A5} ${racer.name} bateu na curva apertada!`
        );
      }
      break;

    case "areia":
      if (chance > 0.6) {
        racer.speedModifier -= 1;
        messages.push(
          `  \u{1F3D6}\uFE0F ${racer.name} pisou na areia e desacelerou!`
        );
      }
      break;

    case "lava":
      if (chance > 0.75) {
        racer.speedModifier -= 3;
        racer.stunned = 1;
        messages.push(
          `  \u{1F525} ${racer.name} tocou na lava! OUCH!`
        );
      }
      break;

    case "bola_de_fogo":
      if (chance > 0.8 && !racer.invincible) {
        racer.speedModifier -= 2;
        racer.stunned = 1;
        messages.push(
          `  \u{1F525} Uma bola de fogo acertou ${racer.name}!`
        );
      }
      break;

    case "sem_grade":
      if (chance > 0.85 + racer.character.handling * 0.01) {
        racer.speedModifier -= 5;
        racer.stunned = 2;
        messages.push(
          `  \u{1F31F} ${racer.name} CAIU da pista! Lakitu esta resgatando...`
        );
      }
      break;

    case "vaca":
      if (chance > 0.85) {
        racer.speedModifier -= 2;
        racer.stunned = 1;
        messages.push(
          `  \u{1F404} ${racer.name} bateu numa vaca! MOO!`
        );
      }
      break;

    case "boost_zone":
      if (chance > 0.4) {
        racer.speedModifier += 2;
        messages.push(
          `  \u{1F680} ${racer.name} pegou uma zona de boost!`
        );
      }
      break;
  }

  return messages;
}
