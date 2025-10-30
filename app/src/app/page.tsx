import { Logout } from "@/components/logout";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="p-5">
      <h1>Neptune</h1>
      <Button>Hello World</Button>
      <Logout />
    </section>
  );
}
