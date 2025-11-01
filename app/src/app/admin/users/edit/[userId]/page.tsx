import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { EditUserForm } from "@/features/admin/users/components/edit-user-form";
import { getUserById } from "@/features/auth/queries";

export default async function EditSong({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await getUserById(userId);

  if (!user) {
    return (
      <section className="py-6 md:py-10">
        <MaxWidthWrapper>
          <h1 className="text-2xl font-bold">User not found</h1>
        </MaxWidthWrapper>
      </section>
    )
  }

  const formattedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  }

  return (
    <section className="py-6 md:py-10">
      <MaxWidthWrapper>
        <EditUserForm data={formattedUser} />
      </MaxWidthWrapper>
    </section>
  )
}
