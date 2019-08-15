import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ServicesService {

  private readonly Container = "https://contenedorgeneralwf.table.core.windows.net/";
  private readonly TableName = "NewVarietiesPoll";
  private readonly ParamsURL = "?sv=2018-03-28&ss=t&srt=sco&sp=rwdlacu&se=2020-10-07T23:43:03Z&st=2019-06-10T15:43:03Z&spr=https,http&sig=zeWpv28QeuczyDWr9Ra%2BFAW4MCXmSM2m12NDfSxFzmM%3D";
  private readonly AZURE_API_URL = this.Container + this.TableName + this.ParamsURL;

  constructor(private http: HttpClient) {
  }

  public setNewAnswer(result): Observable<any> {
    const body = {
      Email: result.Email,
      Name: result.Name,
      INVCode: result.INVCode,
      Answers: result.PollResults,
      PartitionKey: "mypartitionkey",
      RowKey: result.UserId
      //Math.floor(Math.random() * Math.floor(1000)).toString()
    };

    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })    
    };

    return this.http.post<any>(`${this.AZURE_API_URL}`, body, httpOptions);
  }

  public getAllResults(): Observable<any> {
    return this.http.get<any>(`${this.AZURE_API_URL}`);
  }

  public getPoll(language:string): Observable<any> {
     const httpOptions = {
       headers: new HttpHeaders({ "x-functions-key": "Yq2EP5wrdWXv4XyNHogdvGDPC39zu0jenGH0R2bqaocpA5o/PLaVUQ==" })    
     };

    //  { "x-functions-key": "Yq2EP5wrdWXv4XyNHogdvGDPC39zu0jenGH0R2bqaocpA5o/PLaVUQ==",
    //    'Access-Control-Allow-Origin': '*',
    //    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    //    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token' }
    
    return this.http.get<any>(`https://wfinvpollservices.azurewebsites.net/api/GetQuestionCatalog?language=${language.toUpperCase()}`, httpOptions);
  }


  public PostNewUser(login): Observable<any> {
    const body = {
      fullName: login.Name,
      email: login.Email,      
      language: login.Language
    };

    const httpOptions = {
      headers: new HttpHeaders({ "x-functions-key": "Yq2EP5wrdWXv4XyNHogdvGDPC39zu0jenGH0R2bqaocpA5o/PLaVUQ==", "Content-Type": "application/json" })    
    };

    return this.http.post<any>("https://wfinvpollservices.azurewebsites.net/api/GenerateSession", body, httpOptions);
  }

  public SaveAnswer(answer): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ "x-functions-key": "Yq2EP5wrdWXv4XyNHogdvGDPC39zu0jenGH0R2bqaocpA5o/PLaVUQ==", "Content-Type": "application/json" })    
    };
    
    return this.http.post<any>("https://wfinvpollservices.azurewebsites.net/api/SaveQuestionAnswer", answer, httpOptions);
  }

}
