import { Box } from '@chakra-ui/react'
import { Outlet, useLocation } from 'react-router-dom'

/** Nested /trips list + /trips/:id detail — inner outlet remounts on path change. */
export function TripsLayout() {
  const { pathname } = useLocation()
  return (
    <Box key={pathname}>
      <Outlet />
    </Box>
  )
}
