import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Location } from "./location";
import * as L from "leaflet";
import * as esri from "esri-leaflet";

@Injectable()
export class MapService {
  public map: L.Map;
  public baseMaps: any;
  public baseMapType: any;
  private vtLayer: any;

  constructor(private http: HttpClient) {
    const popupTemplate_1 =
      "<h4>Country Info</h4></br>Country: ${Country}</br>FID: ${FID}</br>ISO: ${ISO}</br>COUNTRYAFF: ${COUNTRYAFF}</br>AFF_ISO: ${AFF_ISO}";
    const popupTemplate_2 =
      "<h4>Zone Info</h4></br>ZONE: ${ZONE}</br>FID: ${FID}</br>SQMI: ${SQMI}</br>SQKM: ${SQKM}</br>Colormap: ${Colormap}";
    this.baseMapType = esri.basemapLayer("Streets");
    this.baseMaps = {
      Workd_Countries_Generalized: esri
        .featureLayer({
          url:
            "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0/",
          style: function() {
            return { color: "#70ca49", weight: 2 };
          }
        })
        .bindPopup(function(e) {
          return L.Util.template(popupTemplate_1, e.feature.properties);
        }),
      Workd_Time_Zones: esri
        .featureLayer({
          url:
            "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Time_Zones/FeatureServer/0/"
        })
        .bindPopup(function(e) {
          return L.Util.template(popupTemplate_2, e.feature.properties);
        })
    };
  }

  disableMouseEvent(elementId: string) {
    const element = <HTMLElement>document.getElementById(elementId);

    L.DomEvent.disableClickPropagation(element);
    L.DomEvent.disableScrollPropagation(element);
  }

  toggleMarkerEditing(on: boolean) {
    if (on) {
      this.map.on("click", this.addMarker.bind(this));
    } else {
      this.map.off("click");
    }
  }

  fitBounds(bounds: L.LatLngBounds) {
    this.map.fitBounds(bounds, {});
  }

  private addMarker(e: L.LeafletMouseEvent) {
    const shortLat = Math.round(e.latlng.lat * 1000000) / 1000000;
    const shortLng = Math.round(e.latlng.lng * 1000000) / 1000000;
    const popup = `<div>Latitude: ${shortLat}<div><div>Longitude: ${shortLng}<div>`;
    const icon = L.icon({
      iconUrl: "assets/marker-icon.png",
      shadowUrl: "assets/marker-shadow.png"
    });

    const marker = L.marker(e.latlng, {
      draggable: true,
      icon
    })
      .bindPopup(popup, {
        offset: L.point(12, 6)
      })
      .addTo(this.map)
      .openPopup();

    marker.on("click", () => marker.remove());
  }
}
