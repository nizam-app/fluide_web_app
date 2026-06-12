import { NativeSelect } from '@chakra-ui/react'
import { fluideInputStyles } from '../../theme/fluide-theme'

export function EmailLanguagePicker({ value = 'fr', onChange, disabled }) {
  return (
    <NativeSelect.Root>
      <NativeSelect.Field
        id="email-language"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        css={fluideInputStyles}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </NativeSelect.Field>
    </NativeSelect.Root>
  )
}
