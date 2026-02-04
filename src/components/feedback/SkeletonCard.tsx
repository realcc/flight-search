import { Card, CardContent, Skeleton, Box } from '@mui/material'

export function SkeletonCard() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Box>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={60} height={16} />
          </Box>
          <Skeleton variant="text" width={80} height={32} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Skeleton variant="text" width={60} height={28} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width={40} height={16} sx={{ mx: 'auto' }} />
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Skeleton variant="text" width={60} height={20} sx={{ mx: 'auto' }} />
            <Skeleton variant="rounded" width={80} height={24} sx={{ mx: 'auto', mt: 1 }} />
          </Box>

          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Skeleton variant="text" width={60} height={28} sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width={40} height={16} sx={{ mx: 'auto' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export function SkeletonCardList({ count = 5 }: { count?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Box>
  )
}
