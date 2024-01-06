import { deepClone } from '@/utils'
import { ReactNode } from 'react'
import { PlaygroundState } from './types'

type GridPreset = {
  name: string
  description?: ReactNode
  createState: () => PlaygroundState
}

function createGrids(numGrids: number, numItems: number): PlaygroundState['grids'] {
  return deepClone(
    Array(numGrids).fill({
      items: Array(numItems).fill({}),
    }),
  )
}

export const gridPresets: GridPreset[] = [
  {
    name: 'Default demo',
    description: 'This is the default demo, showing a grid with items of varying sizes depending on the position.',
    createState: () => ({
      wrapperStyles: `display: flex;
      gap: 1rem;`,
      gridStyles: `display: grid;
      flex: 1;
      gap: 1rem;
      padding: 1rem;
      grid-template-columns: 1fr 5fr 3fr;
      grid-template-rows: 1fr 3fr;
      background: var(--pink-1);
      border: 2px solid var(--pink-5);`,
      gridItemStyles: `background: var(--pink-2);
      border: 2px solid var(--pink-5);
      color: var(--pink-8);`,
      grids: createGrids(2, 6),
    }),
  },
  {
    name: 'Sidebar Layout',
    description: 'Typical layout with a left sidebar and main content.',
    createState: () => ({
      wrapperStyles: 'display: block;',
      gridStyles: `display: grid;
      gap: 0.5rem;
      padding: 0.5rem;
      grid-template-columns: minmax(120px, 25%) 1fr;
      background: var(--blue-1);
      border: 2px solid var(--blue-5);`,
      gridItemStyles: `background: var(--blue-2);
      border: 2px solid var(--blue-5);
      color: var(--blue-8);`,
      grids: createGrids(1, 2),
    }),
  },
  {
    name: 'Holy Grail Layout',
    description: `Typical layout with header, main content and footer. 
      Change the height of the wrapper to 100vh to target the page height.`,
    createState: () => ({
      wrapperStyles: `height: 300px;
      `,
      gridStyles: `display: grid;
      gap: 0.5rem;
      padding: 0.5rem;
      height: 100%;
      grid-template-rows: auto 1fr auto;
      background: var(--indigo-1);
      border: 2px solid var(--indigo-5);
      `,
      gridItemStyles: `background: var(--indigo-2);
      border: 2px solid var(--indigo-5);
      color: var(--indigo-8);
      min-width: 120px;`,
      grids: createGrids(1, 3),
    }),
  },
  {
    name: 'Centered Content',
    description: 'The content is fully centered, both horizontally and vertically.',
    createState: () => ({
      wrapperStyles: `display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;`,
      gridStyles: `display: grid;
      place-content: center;
      place-items: center;
      gap: 1ch;
      padding: 0.5rem;
      width: 20%;
      height: 150px;
      background: var(--green-1);
      border: 2px solid var(--green-5);`,
      gridItemStyles: `background: var(--green-2);
      border: 2px solid var(--green-5);
      color: var(--green-8);
      padding: 1rem 2rem;`,
      grids: createGrids(1, 1),
    }),
  },
  {
    name: 'RAM Technique',
    description: 'RAM Technique: Repeat, Auto, Minmax.',
    createState: () => ({
      wrapperStyles: `display: block;
      `,
      gridStyles: `display: grid;
      gap: 0.5rem;
      padding: 0.5rem;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      background: var(--gray-2);
      border: 2px solid var(--gray-5);
      border-radius: 0.5rem;`,
      gridItemStyles: `background: var(--gray-4);
      color: var(--gray-7);
      border-radius: 0.5rem;
      border: 2px solid var(--gray-5);
      padding: 1rem;
      aspect-ratio: 3/2;`,
      grids: createGrids(1, 10),
    }),
  },
  {
    name: 'Pokémon Boxes',
    description: 'This demo combines the RAM Technique with nested grids of 6x5 elements.',
    createState: () => ({
      wrapperStyles: `display: grid;
      grid-template-columns: repeat(auto-fill,minmax(330px,1fr));
      gap: 1rem;
      align-items: start;`,
      gridStyles: `display: grid;
      gap: 0.5rem;
      padding: 0.5rem;
      grid-template-columns: repeat(6, 1fr);
      grid-template-rows: repeat(5, 1fr);
      background: var(--cyan-1);
      border: 2px solid var(--cyan-5);`,
      gridItemStyles: `background: var(--cyan-2);
      border: 2px solid var(--cyan-5);
      color: var(--cyan-8);
      aspect-ratio: 1;`,
      grids: createGrids(3, 30),
    }),
  },
]
