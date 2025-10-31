
import { auth } from "@/lib/auth";

import { MaxWidthWrapper } from "@/components/max-width-wrapper";

import { UserInfo } from "@/features/profile/components/user-info";
import { me } from "@/features/profile/actions";

export default async function Profile() {
  const payload = await auth();

  if (!payload) {
    return null;
  }

  const userData = await me(payload.userId.toString());

  if (!userData) {
    return null;
  }

  return (
    <section className='py-6 md:py-10'>
      <MaxWidthWrapper>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <UserInfo userData={{
              id: userData.id,
              name: userData.name,
              email: userData.email,
              joinDate: userData.joinDate
            }} />
          </div>


        </div>
      </MaxWidthWrapper>
    </section>
  )
}
