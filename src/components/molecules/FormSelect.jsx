import { NativeSelect } from '@chakra-ui/react'
import { MaterialIcon } from '../atoms/MaterialIcon'
import { fluideSelectStyles } from '../../theme/fluide-theme'

export function FormSelect({ value, onChange, disabled, children, id, name }) {
  return (
    <NativeSelect.Root width="full" position="relative" disabled={disabled}>
      <NativeSelect.Field
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        css={fluideSelectStyles}
        disabled={disabled}
      >
        {children}
      </NativeSelect.Field>
      <NativeSelect.Indicator
        position="absolute"
        right="3"
        top="50%"
        transform="translateY(-50%)"
        pointerEvents="none"
        color="onSurfaceVariant"
      >
        <MaterialIcon name="expand_more" size={22} />
      </NativeSelect.Indicator>
    </NativeSelect.Root>
  )
}
