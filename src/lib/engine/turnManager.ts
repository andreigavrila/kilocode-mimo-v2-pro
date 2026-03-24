import type { Stack, TurnOrderQueue } from '../types';
import { isAlive } from '../types';

export function buildTurnOrder(stacks: Stack[]): TurnOrderQueue {
  const aliveStacks = stacks.filter(isAlive);

  aliveStacks.sort((a, b) => {
    if (b.unitType.initiative !== a.unitType.initiative) {
      return b.unitType.initiative - a.unitType.initiative;
    }
    const aIsPlayer1 = a.owner.id === 'player1';
    const bIsPlayer1 = b.owner.id === 'player1';
    if (aIsPlayer1 && !bIsPlayer1) return -1;
    if (!aIsPlayer1 && bIsPlayer1) return 1;
    return a.position.row - b.position.row;
  });

  return {
    entries: aliveStacks,
    activeIndex: 0,
    waitQueue: [],
  };
}

export function advanceTurn(queue: TurnOrderQueue): Stack | null {
  queue.activeIndex += 1;
  if (queue.activeIndex >= queue.entries.length) {
    if (queue.waitQueue.length > 0) {
      queue.waitQueue.sort((a, b) => a.unitType.initiative - b.unitType.initiative);
      queue.entries = [...queue.entries, ...queue.waitQueue];
      queue.waitQueue = [];
      return queue.entries[queue.activeIndex] ?? null;
    }
    return null;
  }
  return queue.entries[queue.activeIndex] ?? null;
}

export function handleWait(queue: TurnOrderQueue): void {
  const stack = queue.entries[queue.activeIndex];
  if (!stack || stack.isWaiting) return;

  stack.isWaiting = true;
  queue.entries.splice(queue.activeIndex, 1);
  queue.waitQueue.push(stack);

  if (queue.activeIndex >= queue.entries.length) {
    if (queue.waitQueue.length > 0) {
      queue.waitQueue.sort((a, b) => a.unitType.initiative - b.unitType.initiative);
      queue.entries = [...queue.entries, ...queue.waitQueue];
      queue.waitQueue = [];
    }
  }
}

export function handleDefend(stack: Stack): void {
  stack.isDefending = true;
  stack.hasActed = true;
}

export function resetRound(stacks: Stack[]): void {
  for (const stack of stacks) {
    if (isAlive(stack)) {
      stack.hasRetaliated = false;
      stack.hasActed = false;
      stack.isWaiting = false;
      stack.isDefending = false;
    }
  }
}
