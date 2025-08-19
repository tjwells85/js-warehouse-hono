import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stats/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/stats/"!</div>
}
