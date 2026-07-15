import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { FormSignup } from "@/components/ui/app-form-sigin-login"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          < FormSignup />
        </div>
      </div>
    </div>
  )
}
