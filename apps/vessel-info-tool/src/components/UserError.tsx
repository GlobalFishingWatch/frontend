import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent } from '@tanstack/react-router'

export function UserErrorComponent({ error }: ErrorComponentProps) {
  return <ErrorComponent error={error} />
}
