import { SignIn } from "@clerk/nextjs";

export default function SignInPage({ searchParams }) {
  const { redirect_url } = searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        afterSignInUrl={redirect_url || "/dashboard"}
        redirectUrl={redirect_url || "/dashboard"}
      />
    </div>
  );
}
