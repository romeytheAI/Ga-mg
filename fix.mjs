import fs from 'fs';
const file = 'src/components/modals/StatusModal.tsx';
let content = fs.readFileSync(file, 'utf8');

const search = `<div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4">Current Equipment</h3>
          <p className="text-sm text-white/80 font-serif italic">{state.player.inventory.filter(i => i.is_equipped).map(i => i.name).join(', ') || 'Naked'}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase text-white/40">Integrity</span>
            <span className="text-[10px] font-mono text-white/60">{Math.round(state.player.inventory.filter(i => i.is_equipped).reduce((acc, i) => acc + (i.integrity || 0), 0) / (state.player.inventory.filter(i => i.is_equipped).length || 1))}%</span>
          </div>
        </div>`;

const replace = `<div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-xs tracking-widest uppercase text-white/50 mb-4">Current Equipment</h3>
          <p className="text-sm text-white/80 font-serif italic">{state.player.inventory.reduce((acc: string[], i) => { if (i.is_equipped) acc.push(i.name); return acc; }, []).join(', ') || 'Naked'}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase text-white/40">Integrity</span>
            <span className="text-[10px] font-mono text-white/60">{(() => {
              const equipped = state.player.inventory.reduce((acc, i) => {
                if (i.is_equipped) {
                  acc.sum += (i.integrity || 0);
                  acc.count++;
                }
                return acc;
              }, { sum: 0, count: 0 });
              return Math.round(equipped.sum / (equipped.count || 1));
            })()}%</span>
          </div>
        </div>`;

if (content.includes(search)) {
    content = content.replace(search, replace);
    fs.writeFileSync(file, content);
    console.log("StatusModal updated.");
} else {
    console.log("Could not find block in StatusModal.");
}
