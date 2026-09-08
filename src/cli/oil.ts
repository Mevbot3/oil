import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadMarketSnapshot } from "@/lib/yahoo";
import type { MarketSnapshot } from "@/lib/basket";
import {
  renderApe,
  renderHelp,
  renderOilnomics,
  renderQuote,
  renderSell,
  renderWhitepaper,
} from "@/lib/render-term";

const amber = (text: string) => `\x1b[38;5;214m${text}\x1b[0m`;
const dim = (text: string) => `\x1b[2m${text}\x1b[0m`;
const promptText = amber("oil@rig") + dim(":") + amber("~") + dim("$ ");

async function main() {
  let market = await loadMarketSnapshot();

  if (!output.isTTY) {
    output.write(`${renderQuote(market)}\n`);
    return;
  }

  output.write(`${amber(renderQuote(market))}\n\n`);
  output.write(`${dim("type help. this is a shell now.")}\n`);

  const rl = readline.createInterface({ input, output });

  while (true) {
    let line: string;
    try {
      line = (await rl.question(promptText)).trim();
    } catch {
      break;
    }
    if (!line) {
      continue;
    }
    const [command, ...rest] = line.split(/\s+/);
    const arg = rest.join(" ");

    if (command === "exit" || command === "quit" || command === "q") {
      output.write(`${dim("rig sealed.")}\n`);
      break;
    }
    if (command === "clear") {
      output.write("\x1b[2J\x1b[H");
      continue;
    }
    if (command === "help" || command === "?") {
      output.write(`${renderHelp()}\n`);
      continue;
    }
    if (command === "oil" || command === "quote" || command === "peg") {
      output.write(`${amber(renderQuote(market))}\n`);
      continue;
    }
    if (command === "daddies" || command === "ls") {
      output.write(`${renderQuote(market).split("\n").slice(8).join("\n")}\n`);
      continue;
    }
    if (command === "whitepaper" || command === "cat") {
      output.write(`${renderWhitepaper()}\n`);
      continue;
    }
    if (command === "oilnomics") {
      output.write(`${renderOilnomics()}\n`);
      continue;
    }
    if (command === "poke" || command === "refresh") {
      market = await refresh(market);
      output.write(`${dim("tape poked.")}\n${amber(renderQuote(market))}\n`);
      continue;
    }
    if (command === "ape" || command === "buy") {
      const usd = Number(arg);
      output.write(`${renderApe(market.price, usd)}\n`);
      continue;
    }
    if (command === "sell" || command === "dump") {
      const tokens = Number(arg);
      output.write(`${renderSell(market.price, tokens)}\n`);
      continue;
    }
    if (command === "desk") {
      output.write(`${dim("chrome desk lives at /desk when the site is up.")}\n`);
      continue;
    }

    output.write(`${dim("unknown command:")} ${command}  ${dim("try help")}\n`);
  }

  rl.close();
}

async function refresh(current: MarketSnapshot): Promise<MarketSnapshot> {
  try {
    return await loadMarketSnapshot();
  } catch {
    return current;
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "rig exploded";
  console.error(message);
  process.exitCode = 1;
});
