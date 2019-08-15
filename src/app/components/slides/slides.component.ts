import { Component, ViewChild, OnInit } from "@angular/core";

import { ServicesService } from "../../services/services.service";
import { LoaderService } from "../../services/loader.services";
import { ToastService } from "../../services/toast.service";

import { Storage } from "@ionic/storage";
import { answers } from "src/app/extensions/models.model";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { NavController } from "@ionic/angular";
import { AlertService } from "../../services/alert.service";

import { IonSlides } from "@ionic/angular";

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-slides",
  templateUrl: "./slides.component.html",
  styleUrls: ["./slides.component.scss"]
})
export class SlidesComponent implements OnInit {
  answers: answers = new answers();
  response: any;
  PollResults: any;
  language: string;
  questions: any;
  optionsSelected = [];

  public Send: string;
  public Error: string;
  public SelectAtLeastOne: string;
  public AnswerSend: string;

  @ViewChild("slidesPoll") slides: IonSlides;

  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
    // onlyExternal: true,    
    // effect: "flip",
    // allowSlideNext: true,
    // allowSlidePrev: true,
    // loop: false,
    // direction: 'horizontal',
    // pager: true,
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    allowTouchMove: false
  };

  constructor(
    private router: NavController,
    private toaster: ToastService,
    private services: ServicesService,
    private loadingService: LoaderService,
    private storage: Storage,
    public emailComposer: EmailComposer,
    private alert: AlertService,
    private _translate: TranslateService
  ) { }

  async ngOnInit() {
    this.loadingService.presentLoading();
    
    this._translate.get('SEND').subscribe((res: any) => {
      this.Send = res;
    });
    this._translate.get('ERROR').subscribe((res: any) => {
      this.Error = res;
    });
    this._translate.get('SELECTATLEATSONE').subscribe((res: any) => {
      this.SelectAtLeastOne = res;
    });
    this._translate.get('ANSWERSEND').subscribe((res: any) => {
      this.AnswerSend = res;
    });

    this.language = this._translate.getBrowserLang();

    const response = await this.services.getPoll(this.language).toPromise().catch(() => {
      return null;
    });

    if (response) {
      this.questions = response;
      this.slides.update();
    }
    else this.toaster.presentErrorToast(this.Error);

    this.loadingService.dismissLoading();
    
    // const Poll = await this.services.getPoll(this.language).subscribe(
    //   (response: any) => {
    //     console.log('subscribe')
    //     this.questions = response;
    //     this.loadingService.dismissLoading();
    //   },
    //   err => {
    //     this.loadingService.dismissLoading();
    //     this.toaster.presentErrorToast("Ocurrió un Error");
    //   }
    // );

  }

  async slideChanged() {
    this.loadingService.presentLoading();
    const index = await this.slides.getActiveIndex();
    let answer = {};
    const user = await this.storage.get("USER_INFO")
    const label = await this.storage.get("labelinfo");
    let options = this.questions[index].options.filter((item) => item.isChecked).map((item) => item.id);

    if (options.length > 0) {
      options.forEach(function (e) {
        answer = {
          "sessionId": user.user_id,
          "responseId": e,
          "INVCode": label[0].LabelConsecutive
        }
      });

      const Poll = await this.services.SaveAnswer(answer).toPromise().catch(() => {
        return "";
      });
  
      if (Poll == "") this.toaster.presentErrorToast(this.Error);
        
      this.slides.slideNext();
    } else this.toaster.presentErrorToast(this.SelectAtLeastOne);

      this.loadingService.dismissLoading();
  }

  private sendEmail() {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {
        //Now we know we can send
      }
    });

    let email = {
      to: this.answers.Email,
      //cc: 'erika@mustermann.deerika@mustermann.de',
      //bcc: ['john@doe.comjohn@doe.com', 'jane@doe.comjane@doe.com'],
      attachments: [
        "file://assets/icon/favicon.png"
        //    'res://icon.png',
        //    'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        //    'file://README.pdf'
      ],
      subject: "Test Email",
      body: "How are you? Nice greetings from Leipzig",
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);

  }

  private async sendPoll(option) {
    this.loadingService.presentLoading();

    const Login = await this.storage.get("USER_INFO");
    const defaultInvCode = await this.storage.get("labelinfo");

    const PollResults = JSON.stringify(this.PollResults);

    this.answers.INVCode = defaultInvCode[0].INVCodeId;
    this.answers.Email = Login.user_email;
    this.answers.Name = Login.user_name;

    this.answers.PollResults = PollResults;

    this.services.setNewAnswer(this.answers).subscribe(
      (response: any) => {
        this.response = response;
        this.loadingService.dismissLoading();
        this.toaster.presentToast(this.AnswerSend);
        //this.router.navigateForward(["charts"]);

        this.alert.presentAlertConfirm();
      },
      err => {
        this.loadingService.dismissLoading();
        this.toaster.presentErrorToast(this.Error);
      }
    );
  }
}
