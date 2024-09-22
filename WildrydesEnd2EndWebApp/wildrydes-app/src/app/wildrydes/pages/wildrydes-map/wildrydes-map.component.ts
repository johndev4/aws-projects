import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { UnicornService } from '../../services/unicorn.service';
import WebMap from '@arcgis/core/WebMap';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol';
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-wildrydes-map',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  templateUrl: './wildrydes-map.component.html',
  styleUrl: './wildrydes-map.component.css',
  providers: [UnicornService],
})
export class WildrydesMapComponent implements OnInit, OnDestroy {
  requestUnicorn() {
    const body = JSON.parse(
      '{"PickupLocation":{"Latitude":47.6174755835663,"Longitude":-122.28837066650185}}'
    );
    this._unicornService.requestUnicorn(body).subscribe((data) => {
      console.log('Response received from API: ', data);

      this.animateArrival(() => {
        var unicorn = data.Unicorn;
        var pronoun = unicorn.Gender === 'Male' ? 'his' : 'her';

        this._snackBar.open(
          `${unicorn.Name}, your ${unicorn.Color}unicorn, is on${pronoun} way.`,
          'Dismiss',
          { duration: 10000 }
        );

        this.unsetLocation();
      });
    });
  }

  protected view!: MapView;
  protected pinGraphic!: Graphic;
  protected unicornGraphic!: Graphic;
  protected selectedPoint!: Point;

  extent!: any;
  center!: any;

  // The <div> where we will place the map
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  private _initializeMap(): Promise<any> {
    const container = this.mapViewEl.nativeElement;

    const webmap = new WebMap({
      portalItem: {
        id: 'aa1d3f80270146208328cf66d022e09c',
      },
      basemap: 'gray-vector',
    });

    this.view = new MapView({
      container: container,
      map: webmap,
    });

    var pinSymbol = new TextSymbol({
      color: '#f50856',
      text: '\ue61d',
      font: {
        size: 20,
        family: 'CalciteWebCoreIcons',
      },
    });

    this.view.watch('extent', this._updateExtent);
    this.view.watch('center', this._updateCenter);

    this.view.on('click', (event) => {
      this.selectedPoint = event.mapPoint;

      this.view.graphics.remove(this.pinGraphic);
      this.pinGraphic = new Graphic({
        symbol: pinSymbol,
        geometry: this.selectedPoint,
      });
      this.view.graphics.add(this.pinGraphic);
    });

    return this.view.when();
  }

  private _updateCenter = (newValue: any) => {
    this.center = {
      latitude: newValue.latitude,
      longitude: newValue.longitude,
    };
  };

  private _updateExtent = (newValue: any) => {
    var min = webMercatorUtils.xyToLngLat(newValue.xmin, newValue.ymin);
    var max = webMercatorUtils.xyToLngLat(newValue.xmax, newValue.ymax);
    this.extent = {
      minLng: min[0],
      minLat: min[1],
      maxLng: max[0],
      maxLat: max[1],
    };
  };

  animateArrival(callback?: () => any) {
    var dest: Point = this.selectedPoint;
    var origin: any = {};

    if (dest.latitude > this.center.latitude) {
      origin.latitude = this.extent.minLat;
    } else {
      origin.latitude = this.extent.maxLat;
    }

    if (dest.longitude > this.center.longitude) {
      origin.longitude = this.extent.minLng;
    } else {
      origin.longitude = this.extent.maxLng;
    }

    this._animate(origin, dest, callback);
  }

  private _animate(origin: any, dest: Point, callback?: () => any) {
    var unicornSymbol = new PictureMarkerSymbol({
      url: '/images/unicorn-icon.png',
      width: '25px',
      height: '25px',
    });

    var startTime: number;
    var step = (timestamp: number) => {
      var progress: number;
      var progressPct: number;
      var point: Point;
      var deltaLat: number;
      var deltaLon: number;
      if (!startTime) startTime = timestamp;
      progress = timestamp - startTime;
      progressPct = Math.min(progress / 2000, 1);
      deltaLat = (dest.latitude - origin.latitude) * progressPct;
      deltaLon = (dest.longitude - origin.longitude) * progressPct;
      point = new Point({
        longitude: origin.longitude + deltaLon,
        latitude: origin.latitude + deltaLat,
      });

      if (!!this.unicornGraphic) this.view.graphics.remove(this.unicornGraphic);
      this.unicornGraphic = new Graphic({
        geometry: point,
        symbol: unicornSymbol,
      });
      this.view.graphics.add(this.unicornGraphic);

      if (progressPct < 1) {
        requestAnimationFrame(step);
      } else {
        callback?.();
      }
    };
    requestAnimationFrame(step);
  }

  protected unsetLocation() {
    if (!!this.pinGraphic) this.view.graphics.remove(this.pinGraphic);
    this.selectedPoint = <any>null;
  }

  constructor(
    private _unicornService: UnicornService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): any {
    // Initialize MapView and return an instance of MapView
    this._initializeMap().then(() => {
      this._updateExtent(this.view.extent);
      this._updateCenter(this.view.center);
      // The map has been initialized
      console.log('The map is ready.');
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      // destroy the map view
      this.view.destroy();
    }
  }
}
