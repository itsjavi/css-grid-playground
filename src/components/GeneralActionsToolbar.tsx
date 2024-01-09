import hidePanelIcon from '@/assets/panel-top-close.svg'
import showPanelIcon from '@/assets/panel-top-open.svg'
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
                <img src={hidePanelIcon} alt="Hide Editors" />
                <span className="sm-hidden">Hide editors</span>
              </button>
            )}
            {!editorsVisible && (
              <button title="Show Editors" type="button" onClick={() => setEditorsVisible(true)}>
                <img src={showPanelIcon} alt="Show Editors" />
                <span className="sm-hidden">Show editors</span>
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
