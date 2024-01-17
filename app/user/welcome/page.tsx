import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const UserWelcome = async () => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  return (
    user && <div>This is the user welcome page of user {user.given_name}!</div>
  );
};

export default UserWelcome;
