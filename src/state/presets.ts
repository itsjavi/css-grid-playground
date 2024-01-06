import { deepClone } from '@/utils'
import { PlaygroundState } from './types'

type GridPreset = {
  name: string
  createState: () => PlaygroundState
}

export const gridPresets: GridPreset[] = [
  {
    name: 'Default demo',
    createState: () => ({
      presetIndex: 0,
      wrapperStyles: `display: flex;
        gap: 1rem;`,
      gridStyles: `display: grid;
        flex: 1;
        gap: 1rem;
        padding: 1rem;
        grid-template-columns: 1fr 5fr 3fr;
        grid-template-rows: 1fr 3fr 1fr;
        background: var(--pink-1);
        border: 2px solid var(--pink-5);`,
      gridItemStyles: `background: var(--pink-2);
        border: 2px solid var(--pink-5);
        color: var(--pink-8);`,
      grids: deepClone(
        Array(2).fill({
          items: Array(9).fill({}),
        }),
      ),
    }),
  },
  {
    name: 'Pokémon Boxes',
    createState: () => ({
      presetIndex: 1,
      wrapperStyles: `display: grid;
        grid-template-columns: repeat(auto-fill,minmax(330px,1fr));
        gap: 1rem;
        align-items: start;`,
      gridStyles: `display: grid;
        gap: 0.5rem;
        padding: 0.5rem;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
        background: var(--cyan-1);
        border: 2px solid var(--cyan-5);`,
      gridItemStyles: `background: var(--green-2);
        border: 2px solid var(--cyan-5);
        color: var(--cyan-8);
        aspect-ratio: 1;`,
      grids: deepClone(
        Array(3).fill({
          items: Array(30).fill({}),
        }),
      ),
    }),
  },
]
