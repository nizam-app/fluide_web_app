import { NativeSelect } from '@chakra-ui/react'
import { fluideCompactInputStyles } from '../../theme/fluide-theme'

export const CURRENCY_OPTIONS = ['EUR', 'USD', 'GBP', 'CHF']

export function CurrencyPicker({ value = 'EUR', onChange }) {
  return (
    <NativeSelect.Root>
      <NativeSelect.Field
        css={fluideCompactInputStyles}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {CURRENCY_OPTIONS.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </NativeSelect.Field>
    </NativeSelect.Root>
  )
}
