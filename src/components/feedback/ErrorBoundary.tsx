import { Component, type ReactNode } from 'react'
import { Button, Paper, Typography } from '@mui/material'
import { ErrorOutline, Refresh } from '@mui/icons-material'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Paper sx={{ p: 4, textAlign: 'center', my: 4 }}>
          <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleRetry}
          >
            Try Again
          </Button>
        </Paper>
      )
    }

    return this.props.children
  }
}
