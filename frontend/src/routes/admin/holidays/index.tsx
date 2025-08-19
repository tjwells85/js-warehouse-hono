import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/holidays/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/holidays/"!</div>
}
