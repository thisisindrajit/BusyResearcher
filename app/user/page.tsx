import { Button } from "@/components/ui/button";
import {
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";

const User = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    user && (
      <div className="flex items-center justify-between">
        This is the user page of user {user.given_name}!
        <LogoutLink>
          <Button>Logout</Button>
        </LogoutLink>
      </div>
    )
  );
};

export default User;
