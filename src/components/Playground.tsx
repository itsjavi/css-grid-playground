import { gridPresets } from '@/state/presets'
import usePlaygroundStore from '@/state/usePlaygroundStore'
import { cn } from '@/utils'
import { ComponentPropsWithoutRef, useState } from 'react'
import { GeneralActionsToolbar } from './GeneralActionsToolbar'
import styles from './Playground.module.scss'
import { GridControllers } from './grid/GridControllers'
import { generateGrids } from './grid/grid-generators'
import AsStyled from './primitives/AsStyled'

type PlaygroundProps = {
  children?: never
} & ComponentPropsWithoutRef<'div'>

export default function Playground({ className, ...props }: PlaygroundProps) {
  const store = usePlaygroundStore()
  const gridElements = generateGrids(store)
  const [showEditors, setShowEditors] = useState(true)
  const presetIndex = store.presetIndex ?? 0
  const currentPreset = gridPresets[presetIndex]
  const presetTitle = presetIndex > 0 ? currentPreset.name : undefined
  const presetDescription = presetIndex > 0 ? currentPreset.description : undefined
  const hasProse = presetTitle || presetDescription

  return (
    <div className={cn(styles.editor, className)} {...props}>
      <div
        className={cn(styles.editorBody, {
          [styles.editorBodyWithoutEditors]: !showEditors,
        })}
      >
        <section className={styles.result}>
          {hasProse && (
            <section>
              {presetTitle && <h2 className={styles.resultTitle}>{presetTitle}</h2>}
              {presetDescription && <div className={styles.resultDescription}>{presetDescription}</div>}
            </section>
          )}
          <div className={styles.resultBody}>
            <AsStyled css={store.wrapperStyles}>{gridElements}</AsStyled>
          </div>
        </section>
        <GeneralActionsToolbar editorsVisible={showEditors} setEditorsVisible={setShowEditors} />
        {showEditors && <GridControllers />}
      </div>
    </div>
  )
}
