import '@src/languages/i18n';
import users from '@src/database/users.json';
import { IUser } from '@src/common/interfaces/dbInterfaces';
import { Redirect } from 'expo-router';

export default function Main() {
  const activeUser: IUser = users.find((user) => user.active) as IUser;

  if (!activeUser) {
    return <Redirect href="/homeScreen" />;
  } else {
    return <Redirect href="/loginScreen" />;
  }
}
