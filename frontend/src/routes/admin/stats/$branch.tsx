import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/stats/$branch')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/stats/$branch"!</div>
}
