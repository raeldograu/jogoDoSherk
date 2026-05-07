// Motor principal da corrida

import { getRandomItem, applyItem } from "./items.js";
import { applyHazard } from "./tracks.js";

export class Racer {
  constructor(character, isPlayer = false) {
    this.character = character;
    this.name = character.name;
    this.isPlayer = isPlayer;
    this.progress = 0;
    this.lap = 0;
    this.finished = false;
    this.finishTime = null;
    this.speedModifier = 0;
    this.item = null;
    this.stunned = 0;
    this.slipping = 0;
    this.boosted = 0;
    this.invincible = 0;
    this.shrunk = 0;
    this.totalDistance = 0;
  }

  getEffectiveSpeed() {
    let base = this.character.speed;

    if (this.stunned > 0) return 0;
    if (this.slipping > 0) return Math.max(base * 0.3, 1);

    base += this.speedModifier;

    if (this.shrunk > 0) base *= 0.6;

    return Math.max(base, 1);
  }

  updateStatusEffects() {
    if (this.stunned > 0) this.stunned--;
    if (this.slipping > 0) this.slipping--;
    if (this.boosted > 0) {
      this.boosted--;
      if (this.boosted === 0) this.speedModifier = Math.max(this.speedModifier - 2, 0);
    }
    if (this.invincible > 0) {
      this.invincible--;
      if (this.invincible === 0) this.speedModifier = Math.max(this.speedModifier - 3, 0);
    }
    if (this.shrunk > 0) this.shrunk--;

    // Gradual recovery of speed modifier
    if (this.speedModifier < 0) {
      this.speedModifier = Math.min(this.speedModifier + 0.5, 0);
    }
    if (this.speedModifier > 5) {
      this.speedModifier = 5;
    }
  }

  getStatusString() {
    const effects = [];
    if (this.stunned > 0) effects.push("\u{1F4AB}Atordoado");
    if (this.slipping > 0) effects.push("\u{1F34C}Derrapando");
    if (this.boosted > 0) effects.push("\u{1F680}Boost");
    if (this.invincible > 0) effects.push("\u2B50Invencivel");
    if (this.shrunk > 0) effects.push("\u{1F41C}Encolhido");
    return effects.length > 0 ? ` [${effects.join(", ")}]` : "";
  }
}

export class Race {
  constructor(track, racers) {
    this.track = track;
    this.racers = racers;
    this.turn = 0;
    this.maxTurns = 100;
    this.events = [];
    this.isFinished = false;
    this.finishOrder = [];
  }

  getPositions() {
    return [...this.racers]
      .sort((a, b) => {
        if (a.lap !== b.lap) return b.lap - a.lap;
        return b.progress - a.progress;
      })
      .map((racer, index) => ({ racer, position: index + 1 }));
  }

  getPlayerPosition() {
    const positions = this.getPositions();
    return positions.find((p) => p.racer.isPlayer);
  }

  simulateTurn(playerAction) {
    this.turn++;
    const turnEvents = [];
    turnEvents.push(`\n${"=".repeat(50)}`);
    turnEvents.push(`  TURNO ${this.turn}`);
    turnEvents.push(`${"=".repeat(50)}`);

    for (const racer of this.racers) {
      if (racer.finished) continue;

      // Player action
      if (racer.isPlayer && playerAction) {
        const actionResult = this.handlePlayerAction(racer, playerAction);
        turnEvents.push(...actionResult);
      }

      // AI action
      if (!racer.isPlayer) {
        const aiResult = this.handleAIAction(racer);
        turnEvents.push(...aiResult);
      }

      // Movement
      const speed = racer.getEffectiveSpeed();
      const randomFactor = (Math.random() * 2 - 1) * 1.5;
      const distance = Math.max(speed + randomFactor, 0.5);
      racer.progress += distance;
      racer.totalDistance += distance;

      // Check lap completion
      if (racer.progress >= this.track.length) {
        racer.lap++;
        racer.progress -= this.track.length;

        if (racer.lap >= this.track.laps) {
          racer.finished = true;
          racer.finishTime = this.turn;
          this.finishOrder.push(racer);
          turnEvents.push(
            `\n  \u{1F3C1} ${racer.name} COMPLETOU A CORRIDA em ${this.getOrdinal(this.finishOrder.length)} lugar!`
          );
        } else {
          turnEvents.push(
            `  \u{1F501} ${racer.name} completou a volta ${racer.lap}/${this.track.laps}!`
          );
        }
      }

      // Apply track hazards
      if (!racer.finished && Math.random() < 0.3) {
        const hazard =
          this.track.hazards[
            Math.floor(Math.random() * this.track.hazards.length)
          ];
        const hazardEvents = applyHazard(racer, hazard);
        turnEvents.push(...hazardEvents);
      }

      // Item box chance
      if (
        !racer.item &&
        !racer.finished &&
        Math.random() < this.track.itemBoxFrequency
      ) {
        const positions = this.getPositions();
        const pos = positions.find((p) => p.racer === racer);
        racer.item = getRandomItem(pos.position, this.racers.length);
        if (racer.isPlayer) {
          turnEvents.push(
            `  \u{1F381} Voce pegou: ${racer.item.emoji} ${racer.item.name}!`
          );
        }
      }

      // Update status effects
      racer.updateStatusEffects();
    }

    // Show positions
    turnEvents.push(this.renderPositions());

    // Check if race is over
    if (this.finishOrder.length === this.racers.length || this.turn >= this.maxTurns) {
      this.isFinished = true;
      // Add remaining racers who didn't finish
      for (const racer of this.racers) {
        if (!racer.finished) {
          racer.finished = true;
          racer.finishTime = this.turn;
          this.finishOrder.push(racer);
        }
      }
    }

    this.events.push(...turnEvents);
    return turnEvents;
  }

  handlePlayerAction(racer, action) {
    const events = [];

    switch (action) {
      case "accelerate": {
        const accelBonus = racer.character.acceleration * 0.15;
        racer.speedModifier += accelBonus;
        events.push(`  \u{1F3CE}\uFE0F Voce acelerou! (+${accelBonus.toFixed(1)} velocidade)`);
        break;
      }

      case "drift": {
        const driftBonus = racer.character.handling * 0.2;
        racer.speedModifier += driftBonus;
        events.push(
          `  \u{1F4A8} Voce fez um drift perfeito! (+${driftBonus.toFixed(1)} velocidade)`
        );
        break;
      }

      case "use_item":
        if (racer.item) {
          const positions = this.getPositions();
          const currentPos = positions.find((p) => p.racer === racer);
          const aheadPos = positions.find(
            (p) => p.position === currentPos.position - 1
          );
          const target = aheadPos ? aheadPos.racer : null;
          const itemEvents = applyItem(
            racer.item,
            racer,
            target,
            this.racers
          );
          events.push(...itemEvents);
          racer.item = null;
        } else {
          events.push("  \u274C Voce nao tem nenhum item!");
        }
        break;

      case "defend":
        racer.speedModifier += 0.5;
        events.push("  \u{1F6E1}\uFE0F Voce esta em posicao defensiva!");
        break;
    }

    return events;
  }

  handleAIAction(racer) {
    const events = [];
    const positions = this.getPositions();
    const pos = positions.find((p) => p.racer === racer);

    // AI uses item if it has one
    if (racer.item && Math.random() < 0.6) {
      const aheadPos = positions.find(
        (p) => p.position === pos.position - 1
      );
      const target = aheadPos ? aheadPos.racer : null;
      const itemEvents = applyItem(racer.item, racer, target, this.racers);
      events.push(...itemEvents);
      racer.item = null;
    }

    // AI random actions
    const random = Math.random();
    if (random < 0.3) {
      racer.speedModifier += racer.character.acceleration * 0.1;
    } else if (random < 0.5) {
      racer.speedModifier += racer.character.handling * 0.1;
    }

    return events;
  }

  renderPositions() {
    const positions = this.getPositions();
    let output = `\n  ${"─".repeat(46)}`;
    output += "\n  POSICOES:";
    output += `\n  ${"─".repeat(46)}`;

    for (const { racer, position } of positions) {
      const marker = racer.isPlayer ? " << VOCE" : "";
      const lapInfo = racer.finished
        ? "\u{1F3C1}FIN"
        : `V${racer.lap + 1}/${this.track.laps}`;
      const progressBar = this.renderProgressBar(
        racer.progress,
        this.track.length
      );
      const status = racer.getStatusString();
      output += `\n  ${position}o ${racer.character.emoji} ${racer.name.padEnd(14)} ${lapInfo} ${progressBar}${status}${marker}`;
    }

    output += `\n  ${"─".repeat(46)}`;
    return output;
  }

  renderProgressBar(progress, total) {
    const barLength = 15;
    const filled = Math.round((progress / total) * barLength);
    const empty = barLength - filled;
    return `[${"█".repeat(filled)}${"░".repeat(empty)}]`;
  }

  getOrdinal(n) {
    return `${n}o`;
  }

  getFinalResults() {
    let output = "\n";
    output += `${"*".repeat(50)}\n`;
    output += `${"*".repeat(15)}  RESULTADO FINAL  ${"*".repeat(15)}\n`;
    output += `${"*".repeat(50)}\n\n`;
    output += `  Pista: ${this.track.emoji} ${this.track.name}\n`;
    output += `  Turnos: ${this.turn}\n\n`;

    const medals = ["\u{1F947}", "\u{1F948}", "\u{1F949}"];

    for (let i = 0; i < this.finishOrder.length; i++) {
      const racer = this.finishOrder[i];
      const medal = medals[i] || `  ${i + 1}o`;
      const marker = racer.isPlayer ? " << VOCE!" : "";
      output += `  ${medal} ${racer.character.emoji} ${racer.name} - Turno ${racer.finishTime}${marker}\n`;
    }

    const playerResult = this.finishOrder.findIndex((r) => r.isPlayer);
    output += "\n";

    if (playerResult === 0) {
      output += "  \u{1F3C6}\u{1F389} PARABENS! VOCE VENCEU A CORRIDA! \u{1F389}\u{1F3C6}\n";
    } else if (playerResult <= 2) {
      output += `  \u{1F44F} Bom trabalho! Voce ficou em ${playerResult + 1}o lugar!\n`;
    } else {
      output += `  \u{1F4AA} Voce ficou em ${playerResult + 1}o lugar. Tente novamente!\n`;
    }

    output += `\n${"*".repeat(50)}\n`;
    return output;
  }
}
