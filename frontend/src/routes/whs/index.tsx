import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/whs/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/whs/"!</div>
}
