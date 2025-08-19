import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/reset/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/reset/"!</div>
}
