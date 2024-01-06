import { GridContainerVirtualDom, PlaygroundState } from '@/state/playgroundStore'
import { safelyJoinCss } from '@/utils'
import GridContainer from './GridContainer'

export function generateGridsVirtualDom(state: PlaygroundState): GridContainerVirtualDom[] {
  const elements: GridContainerVirtualDom[] = []

  for (const i in state.grids) {
    const grid = state.grids[i]

    elements.push({
      className: 'grid',
      style: safelyJoinCss(state.gridStyles, grid.styles),
      children: grid.items.map((item, index) => {
        return {
          className: 'grid-item',
          style: safelyJoinCss(state.gridItemStyles, item.styles),
          innerText: String(index + 1),
        }
      }),
    })
  }

  return elements
}

function indentLines(str: string, indent = 2): string {
  const lines = str.split('\n')

  return (
    ' '.repeat(indent) +
    lines
      .map((line) => ' '.repeat(indent) + line.trimStart())
      .join('\n')
      .trim()
  )
}

export function generateGridsHtmlCode(state: PlaygroundState): string {
  const elements = generateGridsVirtualDom(state)
  const html = elements.map((grid) => {
    const items = grid.children.map((item) => {
      return `<div class="${item.className}">${item.innerText}</div>`
    })

    return `  <div class="${grid.className}">
    ${items.join('\n    ')}
  </div>`
  })

  const styles = `<style>
.wrapper {\n${indentLines(state.wrapperStyles)}\n}
.grid {\n${indentLines(state.gridStyles)}\n}
.grid-item {\n${indentLines(state.gridItemStyles)}\n}
</style>`

  return `${styles}\n
<div class="wrapper">
${html.join('\n')}
</div>\n`
}

export function generateGrids(state: PlaygroundState): JSX.Element[] {
  const domElements = generateGridsVirtualDom(state)
  const elements: JSX.Element[] = []

  for (const i in domElements) {
    const grid = domElements[i]

    elements.push(<GridContainer key={`grid${i}`} className={grid.className} css={grid.style} items={grid.children} />)
  }

  return elements
}
