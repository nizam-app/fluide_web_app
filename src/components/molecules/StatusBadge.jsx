import { Badge } from '@chakra-ui/react'

const variants = {
  scheduled: { bg: 'secondaryContainer', color: 'onSecondaryContainer' },
  active: { bg: 'secondaryContainer', color: 'onSecondaryContainer' },
  in_progress: { bg: 'infoBg', color: 'infoFg' },
  completed: { bg: 'surfaceContainer', color: 'onSurfaceVariant' },
  confirmed: { bg: 'secondaryContainer', color: 'onSecondaryContainer' },
  approved: { bg: 'secondaryContainer', color: 'onSecondaryContainer' },
  accepted: { bg: 'secondaryContainer', color: 'onSecondaryContainer' },
  pending: { bg: 'amberBg', color: 'amberFg' },
  new: { bg: 'errorContainer', color: 'error' },
  processed: { bg: 'infoBg', color: 'infoFg' },
  rejected: { bg: 'errorContainer', color: 'error' },
  cancelled: { bg: 'surfaceContainer', color: 'onSurfaceVariant' },
}

const labels = {
  in_progress: 'In Progress',
  scheduled: 'Scheduled',
  new: 'New',
  processed: 'Processed',
}

export function StatusBadge({ status, label, ...props }) {
  const style = variants[status] ?? variants.pending
  const text = label ?? labels[status] ?? status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')

  return (
    <Badge
      px="3"
      py="1"
      borderRadius="pill"
      textStyle="labelSm"
      letterSpacing="0.04em"
      textTransform="uppercase"
      fontWeight="600"
      bg={style.bg}
      color={style.color}
      {...props}
    >
      {text}
    </Badge>
  )
}
