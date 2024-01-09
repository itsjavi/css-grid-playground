import styles from './GeneralActionsToolbar.module.scss'
import { PresetSelector } from './PresetSelector'
import { ShowCodeTrigger } from './ShowCodeTrigger'
import { ShowShareableUrlrigger } from './ShowShareableUrlrigger'

export function GeneralActionsToolbar({
  editorsVisible,
  setEditorsVisible,
}: { editorsVisible: boolean; setEditorsVisible: (visible: boolean) => void }) {
  return (
    <div className={styles.panel} data-noselect>
      <div className={styles.controlGroup}>
        <PresetSelector />
        <div className={styles.controlGroupNested}>
          <>
            {editorsVisible && (
              <button title="Hide Editors" type="button" onClick={() => setEditorsVisible(false)}>
                Hide Editors
              </button>
            )}
            {!editorsVisible && (
              <button title="Show Editors" type="button" onClick={() => setEditorsVisible(true)}>
                Show Editors
              </button>
            )}
          </>
          <ShowShareableUrlrigger />
          <ShowCodeTrigger />
        </div>
      </div>
    </div>
  )
}
