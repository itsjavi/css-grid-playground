import { GridContainerVirtualDom, PlaygroundState } from '@/state/types'
import { indentLines, safelyJoinCss } from '@/utils'
import GridContainer from './GridContainer'

export function generateGridsVirtualDom(state: PlaygroundState): GridContainerVirtualDom[] {
  const elements: GridContainerVirtualDom[] = []

  for (let i = 0; i < state.grids.length; i++) {
    const grid = state.grids[i]

    elements.push({
      className: `grid grid-${i + 1}`,
      style: safelyJoinCss(state.gridStyles, grid.styles),
      outputStyle: grid.styles,
      children: grid.items.map((item, index) => {
        return {
          className: `grid-item grid-item-${index + 1}`,
          style: safelyJoinCss(state.gridItemStyles, item.styles),
          outputStyle: item.styles,
          innerText: item.text ?? String(index + 1),
        }
      }),
    })
  }

  return elements
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

  const individualStyles = elements
    .map((grid) => {
      const gridCss = grid.outputStyle
        ? `\n.${grid.className.split(' ').pop()} {\n${indentLines(grid.outputStyle)}\n}`
        : ''
      return `<style>${gridCss}
.${grid.children
        .map((item) => {
          if (!item.outputStyle) {
            return undefined
          }
          return `${item.className.split(' ').pop()} {\n${indentLines(item.outputStyle)}\n}`
        })
        .filter(Boolean)
        .join('\n')}
</style>`
    })
    .join('\n')

  return `${styles}\n
${individualStyles}\n
<div class="wrapper">
${html.join('\n')}
</div>\n`
}

export function generateGrids(state: PlaygroundState): JSX.Element[] {
  const domElements = generateGridsVirtualDom(state)
  const elements: JSX.Element[] = []

  for (let i = 0; i < domElements.length; i++) {
    const grid = domElements[i]

    elements.push(
      <GridContainer
        gridIndex={i}
        key={`grid${i}`}
        className={grid.className}
        css={grid.style}
        items={grid.children}
      />,
    )
  }

  return elements
}
