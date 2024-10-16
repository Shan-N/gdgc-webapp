import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import { User } from '@supabase/supabase-js';

// Import the component as a default import
import RFIDAssignmentPage from '@/app/assign-rfid/components/RFIDAssignmentPage';

// Define the props type for RFIDAssignmentPage
type RFIDAssignmentPageProps = {
  user: User;
};

// Extend the imported component with the correct prop types
const TypedRFIDAssignmentPage: React.FC<RFIDAssignmentPageProps> = RFIDAssignmentPage;

export default async function RFIDAssignment() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  // Fetch the user's profile to check for console access
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('has_console_access')
    .eq('id', user.id)
    .single();

  if (error || !profile || !profile.has_console_access) {
    redirect('/');
  }

  // If we've reached this point, the user has console access
  return <TypedRFIDAssignmentPage user={user} />;
}