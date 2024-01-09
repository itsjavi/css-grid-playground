import styles from './GridControllers.module.scss'
import { GridItemsController } from './GridItemsController'
import { GridsController } from './GridsController'
import { WrapperContainerController } from './WrapperContainerController'

export function GridControllers() {
  return (
    <div className={styles.gridControllers}>
      <WrapperContainerController />
      <GridsController />
      <GridItemsController />
    </div>
  )
}
