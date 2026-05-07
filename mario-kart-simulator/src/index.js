#!/usr/bin/env node

// Mario Kart Terminal Simulator
// Simulador de corridas inspirado em Mario Kart para terminal Node.js

import readline from "readline";
import { getCharacters, getCharacterById, getRandomCharacter } from "./characters.js";
import { getTracks, getTrackById } from "./tracks.js";
import { Race, Racer } from "./race.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function printBanner() {
  console.log(`
\x1b[33m╔══════════════════════════════════════════════════════╗
║                                                      ║
║   \x1b[31m🏎️  MARIO KART TERMINAL SIMULATOR  🏎️\x1b[33m              ║
║                                                      ║
║   \x1b[37mSimulador de Corridas no Terminal\x1b[33m                   ║
║   \x1b[37mInspirado no universo Mario Kart\x1b[33m                   ║
║                                                      ║
╚══════════════════════════════════════════════════════╝\x1b[0m
`);
}

function printSectionHeader(title) {
  console.log(`\n\x1b[36m${"═".repeat(50)}\x1b[0m`);
  console.log(`\x1b[36m  ${title}\x1b[0m`);
  console.log(`\x1b[36m${"═".repeat(50)}\x1b[0m\n`);
}

async function selectCharacter() {
  printSectionHeader("SELECAO DE PERSONAGEM");

  const characters = getCharacters();

  for (const char of characters) {
    console.log(
      `  \x1b[33m[${char.id}]\x1b[0m ${char.emoji} \x1b[1m${char.name}\x1b[0m`
    );
    console.log(
      `      Vel: ${"★".repeat(char.speed)}${"☆".repeat(10 - char.speed)}  Acel: ${"★".repeat(char.acceleration)}${"☆".repeat(10 - char.acceleration)}`
    );
    console.log(
      `      Man: ${"★".repeat(char.handling)}${"☆".repeat(10 - char.handling)}  Peso: ${char.weight}`
    );
    console.log(`      ${char.description}`);
    console.log();
  }

  let choice;
  while (true) {
    const input = await ask("\x1b[33m  Escolha seu personagem (1-8): \x1b[0m");
    choice = parseInt(input);
    if (choice >= 1 && choice <= 8) break;
    console.log("\x1b[31m  Opcao invalida! Escolha entre 1 e 8.\x1b[0m");
  }

  const selected = getCharacterById(choice);
  console.log(
    `\n  \x1b[32m✓ Voce escolheu ${selected.emoji} ${selected.name}!\x1b[0m\n`
  );
  return selected;
}

async function selectTrack() {
  printSectionHeader("SELECAO DE PISTA");

  const tracks = getTracks();

  for (const track of tracks) {
    const diffColor =
      track.difficulty === "Facil"
        ? "\x1b[32m"
        : track.difficulty === "Dificil"
          ? "\x1b[31m"
          : track.difficulty === "Extremo"
            ? "\x1b[35m"
            : "\x1b[33m";

    console.log(
      `  \x1b[33m[${track.id}]\x1b[0m ${track.emoji} \x1b[1m${track.name}\x1b[0m`
    );
    console.log(
      `      Dificuldade: ${diffColor}${track.difficulty}\x1b[0m | Voltas: ${track.laps} | Extensao: ${track.length}`
    );
    console.log(`      ${track.description}`);
    console.log();
  }

  let choice;
  while (true) {
    const input = await ask(
      `\x1b[33m  Escolha a pista (1-${tracks.length}): \x1b[0m`
    );
    choice = parseInt(input);
    if (choice >= 1 && choice <= tracks.length) break;
    console.log(
      `\x1b[31m  Opcao invalida! Escolha entre 1 e ${tracks.length}.\x1b[0m`
    );
  }

  const selected = getTrackById(choice);
  console.log(
    `\n  \x1b[32m✓ Pista selecionada: ${selected.emoji} ${selected.name}!\x1b[0m\n`
  );
  return selected;
}

async function selectOpponents(playerCharacterId) {
  printSectionHeader("NUMERO DE COMPETIDORES");

  console.log("  Quantos competidores voce quer enfrentar?");
  console.log("  \x1b[33m[1]\x1b[0m 3 competidores (Rapido)");
  console.log("  \x1b[33m[2]\x1b[0m 5 competidores (Normal)");
  console.log("  \x1b[33m[3]\x1b[0m 7 competidores (Lotado!)");
  console.log();

  let numOpponents;
  while (true) {
    const input = await ask("\x1b[33m  Escolha (1-3): \x1b[0m");
    const choice = parseInt(input);
    if (choice === 1) {
      numOpponents = 3;
      break;
    }
    if (choice === 2) {
      numOpponents = 5;
      break;
    }
    if (choice === 3) {
      numOpponents = 7;
      break;
    }
    console.log("\x1b[31m  Opcao invalida!\x1b[0m");
  }

  const opponents = [];
  const usedIds = [playerCharacterId];

  for (let i = 0; i < numOpponents; i++) {
    const char = getRandomCharacter(usedIds);
    usedIds.push(char.id);
    opponents.push(char);
  }

  console.log("\n  \x1b[36mSeus oponentes serao:\x1b[0m");
  for (const opp of opponents) {
    console.log(`    ${opp.emoji} ${opp.name} (${opp.weight})`);
  }
  console.log();

  return opponents;
}

async function countdown() {
  const messages = [
    "\x1b[31m  3...\x1b[0m",
    "\x1b[33m  2...\x1b[0m",
    "\x1b[32m  1...\x1b[0m",
    "\x1b[1m\x1b[32m  VAI!!! 🏁\x1b[0m",
  ];

  for (const msg of messages) {
    console.log(msg);
    await new Promise((resolve) => setTimeout(resolve, 700));
  }
  console.log();
}

function showPlayerStatus(playerRacer) {
  console.log("\n\x1b[36m  ── SEU STATUS ──\x1b[0m");
  console.log(
    `  ${playerRacer.character.emoji} ${playerRacer.name} | Velocidade: ${playerRacer.getEffectiveSpeed().toFixed(1)}${playerRacer.getStatusString()}`
  );

  if (playerRacer.item) {
    console.log(
      `  Item: ${playerRacer.item.emoji} ${playerRacer.item.name} - ${playerRacer.item.description}`
    );
  } else {
    console.log("  Item: Nenhum");
  }
}

async function getPlayerAction(playerRacer) {
  console.log("\n\x1b[33m  O que voce quer fazer?\x1b[0m");
  console.log("  \x1b[33m[1]\x1b[0m \x1b[1mAcelerar\x1b[0m 🏎️  - Ganhe velocidade!");
  console.log("  \x1b[33m[2]\x1b[0m \x1b[1mDrift\x1b[0m 💨 - Derrape para ganhar boost!");

  if (playerRacer.item) {
    console.log(
      `  \x1b[33m[3]\x1b[0m \x1b[1mUsar Item\x1b[0m ${playerRacer.item.emoji} - ${playerRacer.item.name}`
    );
  } else {
    console.log("  \x1b[90m[3] Usar Item (sem item)\x1b[0m");
  }

  console.log("  \x1b[33m[4]\x1b[0m \x1b[1mDefender\x1b[0m 🛡️  - Posicao defensiva");
  console.log();

  while (true) {
    const input = await ask("\x1b[33m  Acao (1-4): \x1b[0m");
    const choice = parseInt(input);

    switch (choice) {
      case 1:
        return "accelerate";
      case 2:
        return "drift";
      case 3:
        return "use_item";
      case 4:
        return "defend";
      default:
        console.log("\x1b[31m  Escolha entre 1 e 4!\x1b[0m");
    }
  }
}

async function runRace(playerCharacter, track, opponentCharacters) {
  clearScreen();
  printSectionHeader(`CORRIDA: ${track.emoji} ${track.name}`);

  console.log(`  Dificuldade: ${track.difficulty}`);
  console.log(`  Voltas: ${track.laps}`);
  console.log(`  Perigos: ${track.hazards.join(", ")}`);

  // Create racers
  const playerRacer = new Racer(playerCharacter, true);
  const aiRacers = opponentCharacters.map((char) => new Racer(char, false));
  const allRacers = [playerRacer, ...aiRacers];

  const race = new Race(track, allRacers);

  await countdown();

  // Main game loop
  while (!race.isFinished) {
    showPlayerStatus(playerRacer);

    let action;
    if (!playerRacer.finished) {
      action = await getPlayerAction(playerRacer);
    } else {
      console.log(
        "\n  \x1b[32mVoce ja terminou! Assistindo os outros...\x1b[0m"
      );
      await ask("  \x1b[90mPressione ENTER para continuar...\x1b[0m");
      action = null;
    }

    const events = race.simulateTurn(action);

    // Print events
    for (const event of events) {
      console.log(event);
    }

    // Small pause between turns for readability
    if (!race.isFinished) {
      await ask("\n  \x1b[90mPressione ENTER para o proximo turno...\x1b[0m");
      clearScreen();
    }
  }

  // Show final results
  console.log(race.getFinalResults());
}

async function mainMenu() {
  while (true) {
    clearScreen();
    printBanner();

    console.log("  \x1b[33m[1]\x1b[0m \x1b[1mNova Corrida\x1b[0m 🏁");
    console.log("  \x1b[33m[2]\x1b[0m \x1b[1mVer Personagens\x1b[0m 📋");
    console.log("  \x1b[33m[3]\x1b[0m \x1b[1mVer Pistas\x1b[0m 🗺️");
    console.log("  \x1b[33m[4]\x1b[0m \x1b[1mSair\x1b[0m 🚪");
    console.log();

    const input = await ask("\x1b[33m  Escolha uma opcao (1-4): \x1b[0m");
    const choice = parseInt(input);

    switch (choice) {
      case 1: {
        clearScreen();
        const character = await selectCharacter();
        const track = await selectTrack();
        const opponents = await selectOpponents(character.id);

        await ask(
          "\n  \x1b[1m\x1b[33mPressione ENTER para iniciar a corrida!\x1b[0m"
        );

        await runRace(character, track, opponents);

        await ask(
          "\n  \x1b[33mPressione ENTER para voltar ao menu...\x1b[0m"
        );
        break;
      }

      case 2: {
        clearScreen();
        printSectionHeader("TODOS OS PERSONAGENS");
        const chars = getCharacters();
        for (const char of chars) {
          console.log(
            `  ${char.emoji} \x1b[1m${char.name}\x1b[0m - ${char.description}`
          );
          console.log(
            `     Vel: ${char.speed}/10 | Acel: ${char.acceleration}/10 | Man: ${char.handling}/10 | Peso: ${char.weight}`
          );
          console.log();
        }
        await ask("  \x1b[33mPressione ENTER para voltar...\x1b[0m");
        break;
      }

      case 3: {
        clearScreen();
        printSectionHeader("TODAS AS PISTAS");
        const tracks = getTracks();
        for (const track of tracks) {
          console.log(
            `  ${track.emoji} \x1b[1m${track.name}\x1b[0m - ${track.difficulty}`
          );
          console.log(`     ${track.description}`);
          console.log(
            `     Voltas: ${track.laps} | Extensao: ${track.length} | Perigos: ${track.hazards.join(", ")}`
          );
          console.log();
        }
        await ask("  \x1b[33mPressione ENTER para voltar...\x1b[0m");
        break;
      }

      case 4:
        console.log(
          "\n  \x1b[32mObrigado por jogar! Ate a proxima corrida! 🏁\x1b[0m\n"
        );
        rl.close();
        process.exit(0);
        break;

      default:
        console.log("\x1b[31m  Opcao invalida!\x1b[0m");
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Start the game
mainMenu().catch((err) => {
  console.error("Erro:", err);
  rl.close();
  process.exit(1);
});
