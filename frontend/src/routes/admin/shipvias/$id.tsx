import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/shipvias/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/shipvias/$id"!</div>
}
