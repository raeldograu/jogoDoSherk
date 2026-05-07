// Sistema de itens classicos do Mario Kart

const ITEMS = [
  {
    id: "banana",
    name: "Banana",
    emoji: "\u{1F34C}",
    description: "Deixa uma casca no caminho. Quem pisar, derrapa!",
    rarity: 0.2,
    effect: "slip",
  },
  {
    id: "green_shell",
    name: "Casco Verde",
    emoji: "\u{1F7E2}",
    description: "Dispara em linha reta. Acerta quem estiver na frente!",
    rarity: 0.2,
    effect: "hit",
  },
  {
    id: "red_shell",
    name: "Casco Vermelho",
    emoji: "\u{1F534}",
    description: "Persegue o corredor a frente automaticamente!",
    rarity: 0.15,
    effect: "hit_targeted",
  },
  {
    id: "mushroom",
    name: "Cogumelo",
    emoji: "\u{1F344}",
    description: "Boost de velocidade temporario!",
    rarity: 0.2,
    effect: "boost",
  },
  {
    id: "star",
    name: "Estrela",
    emoji: "\u2B50",
    description: "Invencibilidade e velocidade maxima por um tempo!",
    rarity: 0.05,
    effect: "invincible",
  },
  {
    id: "lightning",
    name: "Raio",
    emoji: "\u26A1",
    description: "Encolhe e desacelera TODOS os outros corredores!",
    rarity: 0.05,
    effect: "shrink_all",
  },
  {
    id: "blue_shell",
    name: "Casco Azul",
    emoji: "\u{1F535}",
    description: "Persegue e explode o corredor em 1o lugar!",
    rarity: 0.05,
    effect: "hit_first",
  },
  {
    id: "triple_mushroom",
    name: "Cogumelo Triplo",
    emoji: "\u{1F344}\u{1F344}\u{1F344}",
    description: "Tres boosts de velocidade seguidos!",
    rarity: 0.1,
    effect: "triple_boost",
  },
];

export function getRandomItem(position, totalRacers) {
  // Jogadores em posicoes piores ganham itens melhores (rubber-banding)
  const positionRatio = position / totalRacers;

  let weightedItems;

  if (positionRatio > 0.7) {
    // Ultimas posicoes - itens poderosos
    weightedItems = ITEMS.map((item) => ({
      ...item,
      weight:
        item.effect === "invincible" ||
        item.effect === "shrink_all" ||
        item.effect === "hit_first" ||
        item.effect === "triple_boost"
          ? 3
          : 1,
    }));
  } else if (positionRatio > 0.4) {
    // Posicoes intermediarias - itens medios
    weightedItems = ITEMS.map((item) => ({
      ...item,
      weight:
        item.effect === "hit" ||
        item.effect === "hit_targeted" ||
        item.effect === "boost"
          ? 3
          : 1,
    }));
  } else {
    // Primeiras posicoes - itens defensivos
    weightedItems = ITEMS.map((item) => ({
      ...item,
      weight: item.effect === "slip" || item.effect === "boost" ? 3 : 1,
    }));
  }

  const totalWeight = weightedItems.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of weightedItems) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }

  return weightedItems[0];
}

export function applyItem(item, user, target, allRacers) {
  const results = [];

  switch (item.effect) {
    case "slip":
      if (target && !target.invincible) {
        target.speedModifier = Math.max(target.speedModifier - 3, -5);
        target.slipping = 2;
        results.push(
          `${item.emoji} ${user.name} jogou uma Banana! ${target.name} derrapou!`
        );
      } else {
        results.push(
          `${item.emoji} ${user.name} jogou uma Banana, mas ninguem pisou!`
        );
      }
      break;

    case "hit":
      if (target && !target.invincible) {
        target.speedModifier = Math.max(target.speedModifier - 4, -5);
        target.stunned = 2;
        results.push(
          `${item.emoji} ${user.name} acertou ${target.name} com um Casco Verde!`
        );
      } else {
        results.push(
          `${item.emoji} ${user.name} lancou um Casco Verde, mas errou!`
        );
      }
      break;

    case "hit_targeted": {
      const ahead = allRacers
        .filter((r) => r.progress > user.progress && !r.invincible)
        .sort((a, b) => a.progress - b.progress);
      const victim = ahead[0];
      if (victim) {
        victim.speedModifier = Math.max(victim.speedModifier - 4, -5);
        victim.stunned = 2;
        results.push(
          `${item.emoji} Casco Vermelho perseguiu e acertou ${victim.name}!`
        );
      } else {
        results.push(
          `${item.emoji} ${user.name} lancou um Casco Vermelho, mas nao tinha alvo!`
        );
      }
      break;
    }

    case "boost":
      user.speedModifier += 4;
      user.boosted = 2;
      results.push(
        `${item.emoji} ${user.name} usou um Cogumelo! VROOOOM!`
      );
      break;

    case "triple_boost":
      user.speedModifier += 6;
      user.boosted = 3;
      results.push(
        `${item.emoji} ${user.name} usou Cogumelo Triplo! VROOOOOOM!`
      );
      break;

    case "invincible":
      user.invincible = 3;
      user.speedModifier += 5;
      results.push(
        `${item.emoji} ${user.name} pegou uma Estrela! INVENCIVEL!`
      );
      break;

    case "shrink_all":
      for (const racer of allRacers) {
        if (racer !== user && !racer.invincible) {
          racer.speedModifier = Math.max(racer.speedModifier - 3, -5);
          racer.shrunk = 3;
        }
      }
      results.push(
        `${item.emoji} RAIO! ${user.name} encolheu todos os outros!`
      );
      break;

    case "hit_first": {
      const first = allRacers
        .filter((r) => r !== user)
        .sort((a, b) => b.progress - a.progress)[0];
      if (first && !first.invincible) {
        first.speedModifier = Math.max(first.speedModifier - 6, -8);
        first.stunned = 3;
        results.push(
          `${item.emoji} CASCO AZUL! Explodiu ${first.name} em 1o lugar!`
        );
      } else {
        results.push(
          `${item.emoji} Casco Azul lancado, mas o lider era invencivel!`
        );
      }
      break;
    }
  }

  return results;
}

export function getItemById(id) {
  return ITEMS.find((i) => i.id === id);
}
