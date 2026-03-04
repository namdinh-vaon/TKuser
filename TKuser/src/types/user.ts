export interface User {
  id: number;
  name: {
    firstname: string;
    lastname: string;
  };
  email: string;
  username: string;
  password: string;
  avatar: string;
  date: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
}
