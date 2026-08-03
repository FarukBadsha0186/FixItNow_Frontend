
import { Suspense } from 'react';
import { Navbar } from "@/components/shared/navbar";
import { getMe } from '@/service/getMe';




async function DashboardContent({ children }: { children: React.ReactNode }) {
  const user = await getMe(); 
  return (
    <div>
      <Navbar user={user}/>
      {children}
    </div>
  );
}


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<div></div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

export default DashboardLayout;