export interface CodeInfo {
  invCodeId: string;
  ComercialName: string;
  Favorite: boolean;
  photoUrl: string;
  labelConsecutive: string;
}

export class answers {
  Email: string = "";
  Name: string = "";
  INVCode?: string = "";
  PollResults?: string = "";
}

export class login {
  Email: string = "";
  Name: string = "";
  CodeVerify: string = "WFGS2019";
  UserId: string = "";
  Company: string = "";
  Terms: boolean = false;
  Language: string = "ES";
}
