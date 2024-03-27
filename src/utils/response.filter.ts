import { IUser } from "@/resources/user/user.model";

export const filteredUser = (user: IUser): Partial<IUser> => {
  const { _id, fullName, email, userType, createdAt, updatedAt } = user;
  return {
    _id,
    fullName,
    email,
    userType,
    createdAt,
    updatedAt,
  };
};
