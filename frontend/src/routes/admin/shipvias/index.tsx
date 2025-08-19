import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/shipvias/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/shipvias/"!</div>
}
