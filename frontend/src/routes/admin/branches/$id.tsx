import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/branches/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/branches/$id"!</div>
}
