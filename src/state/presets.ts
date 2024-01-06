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
        gap: 1rem;
        padding: 0 1rem 1rem 1rem;`,
      gridStyles: `display: grid;
        gap: 1rem;
        flex: 1;
        padding: 1rem;
        background: var(--pink-1);
        grid-template-columns: 1fr 5fr 3fr;
        grid-template-rows: 1fr 3fr 1fr;
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
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
        padding: 0 1rem 1rem 1rem;`,
      gridStyles: `display: grid;
        gap: 0.5rem;
        padding: 0.5rem;
        background: var(--cyan-1);
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
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
