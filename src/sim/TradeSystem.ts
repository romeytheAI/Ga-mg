/**
 * TradeSystem — handles supply chains, trade routes, and resource movement.
 * Pure functions for the SimWorld.
 */
import { SimWorld, SupplyNode, TradeRoute } from './types';

/**
 * Tick the supply chain and trade routes.
 */
export function tickTrade(world: SimWorld): SimWorld {
  const { nodes, routes } = world.civilization.supply_chains;
  
  // 1. Production Phase
  const nextNodes = nodes.map(node => {
    const nextNode = { ...node, inventory: { ...node.inventory } };
    node.produces.forEach(res => {
      nextNode.inventory[res] = (nextNode.inventory[res] || 0) + node.throughput;
    });
    // Consumption
    node.consumes.forEach(res => {
      nextNode.inventory[res] = Math.max(0, (nextNode.inventory[res] || 0) - (node.throughput / 2));
    });
    return nextNode;
  });

  // 2. Trade Movement Phase
  routes.forEach(route => {
    const fromNode = nextNodes.find(n => n.location_id === route.from_node);
    const toNode = nextNodes.find(n => n.location_id === route.to_node);
    
    if (fromNode && toNode && fromNode.inventory[route.resource] > 0) {
      const amountToMove = Math.min(fromNode.inventory[route.resource], 10 * route.efficiency);
      fromNode.inventory[route.resource] -= amountToMove;
      toNode.inventory[route.resource] = (toNode.inventory[route.resource] || 0) + amountToMove;
    }
  });

  return {
    ...world,
    civilization: {
      ...world.civilization,
      supply_chains: {
        nodes: nextNodes,
        routes
      }
    }
  };
}

/**
 * Get local price multiplier for a resource at a location.
 * High supply → lower price; Scarcity → higher price.
 */
export function getSupplyChainPriceMod(world: SimWorld, locationId: string, resource: string): number {
  const node = world.civilization.supply_chains.nodes.find(n => n.location_id === locationId);
  if (!node) return 1.0;
  
  const inv = node.inventory[resource] || 0;
  if (inv > 100) return 0.7; // Abundance
  if (inv < 5) return 2.5;   // Critical Scarcity
  return 1.0;
}
