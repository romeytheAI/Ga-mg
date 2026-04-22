import { describe, it, expect } from 'vitest';
import { tickTrade, getSupplyChainPriceMod } from './TradeSystem';
import { SimWorld, SupplyNode, TradeRoute } from './types';

function createMockWorld(nodes: SupplyNode[], routes: TradeRoute[]): SimWorld {
  return {
    civilization: {
      supply_chains: {
        nodes,
        routes
      }
    }
  } as unknown as SimWorld;
}

describe('TradeSystem', () => {
  describe('tickTrade', () => {
    it('produces and consumes resources at nodes', () => {
      const initialNodes: SupplyNode[] = [
        {
          location_id: 'locA',
          produces: ['iron', 'wheat'],
          consumes: ['tools'],
          throughput: 10,
          inventory: { iron: 0, tools: 20 }
        }
      ];
      
      const world = createMockWorld(initialNodes, []);
      const nextWorld = tickTrade(world);
      
      const nextNode = nextWorld.civilization.supply_chains.nodes[0];
      
      // Produced
      expect(nextNode.inventory['iron']).toBe(10);
      expect(nextNode.inventory['wheat']).toBe(10);
      
      // Consumed (throughput / 2 = 5)
      expect(nextNode.inventory['tools']).toBe(15);
    });

    it('moves resources along trade routes', () => {
      const initialNodes: SupplyNode[] = [
        {
          location_id: 'farm',
          produces: ['wheat'],
          consumes: [],
          throughput: 20,
          inventory: { wheat: 50 }
        },
        {
          location_id: 'city',
          produces: [],
          consumes: ['wheat'],
          throughput: 10,
          inventory: { wheat: 0 }
        }
      ];
      const routes: TradeRoute[] = [
        {
          id: 'route1',
          from_node: 'farm',
          to_node: 'city',
          resource: 'wheat',
          efficiency: 1.5,
          active_caravans: 0
        }
      ];

      const world = createMockWorld(initialNodes, routes);
      const nextWorld = tickTrade(world);

      const nextFarm = nextWorld.civilization.supply_chains.nodes.find(n => n.location_id === 'farm');
      const nextCity = nextWorld.civilization.supply_chains.nodes.find(n => n.location_id === 'city');

      // Farm produces 20, so inventory = 50 + 20 = 70.
      // City consumes 5, inventory = 0 (max(0, 0-5)).
      // Movement: moves min(70, 10 * 1.5) = 15 from farm to city
      // Final Farm: 70 - 15 = 55
      // Final City: 0 + 15 = 15

      expect(nextFarm?.inventory['wheat']).toBe(55);
      expect(nextCity?.inventory['wheat']).toBe(15);
    });

    it('handles missing nodes in trade routes gracefully', () => {
      const initialNodes: SupplyNode[] = [
        {
          location_id: 'farm',
          produces: ['wheat'],
          consumes: [],
          throughput: 20,
          inventory: { wheat: 50 }
        }
      ];
      const routes: TradeRoute[] = [
        {
          id: 'route1',
          from_node: 'farm',
          to_node: 'ghost_city',
          resource: 'wheat',
          efficiency: 1.0,
          active_caravans: 0
        }
      ];

      const world = createMockWorld(initialNodes, routes);
      const nextWorld = tickTrade(world);

      const nextFarm = nextWorld.civilization.supply_chains.nodes.find(n => n.location_id === 'farm');
      
      // Farm produces 20, total 70. Route should do nothing since to_node is missing.
      expect(nextFarm?.inventory['wheat']).toBe(70);
    });
  });

  describe('getSupplyChainPriceMod', () => {
    it('returns 1.0 if node is not found', () => {
      const world = createMockWorld([], []);
      expect(getSupplyChainPriceMod(world, 'loc', 'wheat')).toBe(1.0);
    });

    it('returns 0.7 if resource is in abundance', () => {
      const nodes: SupplyNode[] = [
        { location_id: 'locA', produces: [], consumes: [], throughput: 0, inventory: { iron: 150 } }
      ];
      const world = createMockWorld(nodes, []);
      expect(getSupplyChainPriceMod(world, 'locA', 'iron')).toBe(0.7);
    });

    it('returns 2.5 if resource is critically scarce', () => {
      const nodes: SupplyNode[] = [
        { location_id: 'locA', produces: [], consumes: [], throughput: 0, inventory: { iron: 2 } },
        { location_id: 'locB', produces: [], consumes: [], throughput: 0, inventory: {} }
      ];
      const world = createMockWorld(nodes, []);
      expect(getSupplyChainPriceMod(world, 'locA', 'iron')).toBe(2.5);
      expect(getSupplyChainPriceMod(world, 'locB', 'iron')).toBe(2.5); // 0 < 5
    });

    it('returns 1.0 if resource has normal inventory levels', () => {
      const nodes: SupplyNode[] = [
        { location_id: 'locA', produces: [], consumes: [], throughput: 0, inventory: { iron: 50 } }
      ];
      const world = createMockWorld(nodes, []);
      expect(getSupplyChainPriceMod(world, 'locA', 'iron')).toBe(1.0);
    });
  });
});
