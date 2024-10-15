import { createClient } from '@/app/utils/supabase/server'
import Link from 'next/link'

export default async function Forms() {
  const supabase = createClient()
  const { data: forms } = await supabase.from('forms').select('*')

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-center">All Forms</h1>
        <ul>
          {forms?.map((form) => (
            <li key={form.id} className="mb-2">
              <Link href={`/forms/${form.id}`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  {form.title}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}