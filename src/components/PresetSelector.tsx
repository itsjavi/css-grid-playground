import restoreIcon from '@/assets/history.svg'
import { gridPresets } from '@/state/presets'
import usePlaygroundStore from '@/state/usePlaygroundStore'
import { useRef } from 'react'
import styles from './PresetSelector.module.scss'

export function PresetSelector() {
  const store = usePlaygroundStore()
  const currentRef = useRef<string>(String(store.presetIndex ?? 0))

  return (
    <div className={styles.selectWithButton}>
      <span>Preset: </span>
      <select
        defaultValue={store.presetIndex}
        onChange={(e) => {
          currentRef.current = e.target.value
          if (!store.lastModified) {
            store.selectPreset(Number(e.target.value))
          }
        }}
      >
        {gridPresets.map((preset, index) => {
          return (
            <option key={`preset-${index}`} value={index}>
              {/* {index === 0 ? '---' : preset.name} */}
              {preset.name}
            </option>
          )
        })}
      </select>
      {store.lastModified !== undefined && (
        <button
          title="Reset all changes and load the original preset"
          type="button"
          onClick={() => {
            store.selectPreset(Number(currentRef.current))
          }}
        >
          <img src={restoreIcon} alt="Reset" />
          <span className="sm-hidden">Restore</span>
        </button>
      )}
    </div>
  )
}
