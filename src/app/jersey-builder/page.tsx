import { redirect } from "next/navigation";

export default function JerseyBuilderRedirect() {
  redirect("/shop?category=jerseys");
}
