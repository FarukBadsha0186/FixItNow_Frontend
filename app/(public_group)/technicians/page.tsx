
export const dynamic = 'force-dynamic';
import { getTechnicians } from '../_public_action/action'
import { TechnicianGrid } from '../_public_components/public_components'

export default async function TechniciansPage() {
  const data = await getTechnicians()
  const technicians = data?.data || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">All Technicians</h1>
        <p className="text-muted-foreground mt-2">
          Browse our trusted professionals and book their services
        </p>
      </div>

      <TechnicianGrid technicians={technicians} />
    </div>
  )
}