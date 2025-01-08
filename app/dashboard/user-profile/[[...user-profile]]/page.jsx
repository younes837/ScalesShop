import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="container mx-auto py-6">
    <UserProfile path="/dashboard/user-profile" routing="path" />
  </div>
);

export default UserProfilePage;
