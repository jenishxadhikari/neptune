import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { MainApp } from "@/features/main/components/main-app";

export default function Home() {
  return (
    <section className='py-6 md:py-10'>
      <MaxWidthWrapper>
        <MainApp />
      </MaxWidthWrapper>
    </section>
  );
}
