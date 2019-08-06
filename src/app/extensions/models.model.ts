export interface CodeInfo {
  INVCodeId: string;
  ComercialName: string;
  Favorite: boolean;
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
