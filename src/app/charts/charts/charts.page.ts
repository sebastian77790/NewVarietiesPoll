import { Component, OnInit } from "@angular/core";
import { LoaderService } from "../../services/loader.services";
import { ToastService } from "../../services/toast.service";

import { GoogleCharts } from "google-charts";
import { AuthenticationService } from "../../services/authentication.service";
import { ServicesService } from "src/app/services/services.service";

@Component({
  selector: "app-charts",
  templateUrl: "./charts.page.html",
  styleUrls: ["./charts.page.scss"]
})
export class ChartsPage {
  response: any;

  constructor(
    private authService: AuthenticationService,
    private toaster: ToastService,
    private services: ServicesService,
    private loadingService: LoaderService
  ) {}

  ngOnInit() {
    GoogleCharts.load(this.drawChart);
  }

  private drawChart = () => {
    this.services.getAllResults().subscribe(
      (response: any) => {
        this.response = response;
        debugger;
        this.loadingService.dismissLoading();
      },
      err => {
        this.loadingService.dismissLoading();
        this.toaster.presentErrorToast("Ocurrió un Error");
      }
    );
    // Standard google charts functionality is available as GoogleCharts.api after load
    const data = GoogleCharts.api.visualization.arrayToDataTable([
      ["Chart thing", "Chart amount"],
      ["Lorem ipsum", 200],
      ["Dolor sit", 22],
      ["Sit amet", 18]
    ]);
    const pie_1_chart = new GoogleCharts.api.visualization.PieChart(
      document.getElementById("chart1")
    );
    pie_1_chart.draw(data);
  };

  logoutUser() {
    this.authService.logout();
  }
}
