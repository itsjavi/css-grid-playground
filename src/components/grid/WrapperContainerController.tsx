import usePlaygroundStore from '@/state/usePlaygroundStore'
import GridController from './GridController'

export function WrapperContainerController() {
  const [code, setCode, resetCode] = usePlaygroundStore((state) => [
    state.wrapperStyles,
    state.setWrapperStyles,
    state.resetWrapperStyles,
  ])

  return (
    <GridController
      title="Wrapper Styles"
      code={code}
      onCodeChange={({ code }) => {
        setCode(code)
      }}
      buttons={['collapse']}
      onResetClick={() => {
        resetCode()
      }}
    />
  )
}
