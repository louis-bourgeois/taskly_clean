import { redirect } from "next/navigation";
export default function page() {
  redirect("/app/currently");
  return <div>boouh</div>;
}
