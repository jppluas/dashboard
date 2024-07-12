import { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Indicator from "./components/Indicator";
import Atardecer from "./components/Atardecer";
import Amanecer from "./components/Amanecer";
import ControlPanel from "./components/ControlPanel";
import BasicTable from "./components/BasicTable";

import "./App.css";

function App() {
  let [rowsTable, setRowsTable] = useState<
    { rangeHours: string; windDirection: string }[]
  >([]);
  let [indicators, setIndicators] = useState<JSX.Element[]>([]);
  let [listas, setListas] = useState<any[][]>([]);
  let [amanecer, setAmanecer] = useState<string>("");
  let [atardecer, setAtardecer] = useState<string>("");

  var precipitaciones: Array<[any, any]> = [["Hora", "Precipitación"]];
  var humedades: Array<[any, any]> = [["Hora", "Humedad"]];
  var nubosidades: Array<[any, any]> = [["Hora", "Nubosidad"]];
  var temperaturas: Array<[any, any]> = [["Hora", "Temperatura"]];
  var visibilidades: Array<[any, any]> = [["Hora", "Visibilidad"]];

  const [ultimaUpdate, setUltimaUpdate] = useState<string>("");

  useEffect(() => {
    (async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap");
      let expiringTime = localStorage.getItem("expiringTime");
      let currentTime = localStorage.getItem("currentTime");
      let nowTime = new Date().getTime();

      if (
        expiringTime === null ||
        nowTime > parseInt(expiringTime) ||
        currentTime === null
      ) {
        let API_KEY = "c45a8618fc83e03c7355f428f9ffa221";
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
        );
        savedTextXML = await response.text();

        let hours = 1;
        let delay = hours * 3600000;

        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", (nowTime + delay).toString());

        let currentTime = new Date().toLocaleTimeString();
        localStorage.setItem("currentTime", currentTime);
        setUltimaUpdate(currentTime);
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        let dataToIndicators: Array<[string, string, string]> = [];

        let ciudad = xml.getElementsByTagName("name")[0].innerHTML;
        let location = xml.getElementsByTagName("location")[1];

        let latitude = location.getAttribute("latitude")!;
        dataToIndicators.push([ciudad, "Latitude", latitude]);

        let longitude = location.getAttribute("longitude")!;
        dataToIndicators.push([ciudad, "Longitude", longitude]);

        setUltimaUpdate(currentTime || "");
        const sunsetTime = xml.querySelector("sun")?.getAttribute("set");
        const sunriseTime = xml.querySelector("sun")?.getAttribute("rise");

        if (sunsetTime) {
          setAtardecer(new Date(sunsetTime).toLocaleTimeString());
        } else {
          // Handle the case where sunsetTime is null
          setAtardecer("N/A"); // Or any default/fallback value
        }

        if (sunriseTime) {
          setAmanecer(new Date(sunriseTime).toLocaleTimeString());
        } else {
          // Handle the case where sunriseTime is null
          setAmanecer("N/A"); // Or any default/fallback value
        }
        let indicatorsElements = Array.from(dataToIndicators).map((element) => (
          <Indicator
            title={element[0]}
            subtitle={element[1]}
            value={element[2]}
          />
        ));

        setIndicators(indicatorsElements);

        let vientos = Array.from(xml.getElementsByTagName("time")).map(
          (timeElement) => {
            let fromAttr = timeElement.getAttribute("from");
            let toAttr = timeElement.getAttribute("to");

            let rangeHours =
              fromAttr?.split("T")[1] + " - " + toAttr?.split("T")[1];

            let windDirection =
              timeElement
                .getElementsByTagName("windDirection")[0]
                .getAttribute("deg")! +
              " " +
              timeElement
                .getElementsByTagName("windDirection")[0]
                .getAttribute("code")!;

            return { rangeHours: rangeHours!, windDirection: windDirection };
          }
        );

        vientos = vientos.slice(0, 8);
        setRowsTable(vientos);

        const kelvinToCelsius = (kelvin: number) => kelvin - 273.15;

        Array.from(xml.getElementsByTagName("time")).map((timeNode) => {
          const from = timeNode.getAttribute("from");
          const temperatureNode =
            timeNode.getElementsByTagName("temperature")[0];
          const humidityNode = timeNode.getElementsByTagName("humidity")[0];
          const precipitationNode =
            timeNode.getElementsByTagName("precipitation")[0];
          const cloudsNode = timeNode.getElementsByTagName("clouds")[0];
          const visibilityNode = timeNode.getElementsByTagName("visibility")[0];

          if (
            from &&
            temperatureNode &&
            humidityNode &&
            precipitationNode &&
            cloudsNode &&
            visibilityNode
          ) {
            const temperatura = kelvinToCelsius(
              parseInt(temperatureNode.getAttribute("value")!)
            );
            const precipitacion = parseInt(
              precipitationNode.getAttribute("probability")!
            );
            const humedad = parseInt(humidityNode.getAttribute("value")!);
            const nubosidad = parseInt(cloudsNode.getAttribute("all")!);
            const visibilidad = parseInt(visibilityNode.getAttribute("value")!);
            const hora =
              new Date(from).getHours() + ":" + new Date(from).getMinutes();

            temperaturas.push([hora, temperatura]);
            precipitaciones.push([hora, precipitacion]);
            humedades.push([hora, humedad]);
            nubosidades.push([hora, nubosidad]);
            visibilidades.push([hora, visibilidad]);
          }
        });

        setListas([
          precipitaciones,
          humedades,
          nubosidades,
          temperaturas,
          visibilidades,
        ]);
      }
    })();
  }, []);

  return (
    <>
      <h1>Guayaquil</h1>

      <Grid container spacing={5}>
        <Grid xs={12} sm={4} md={3} lg={4}>
          <Indicator
            subtitle="Última actualización"
            value={ultimaUpdate.toString()}
          />
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={4}>
          {indicators[0]}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={4}>
          {indicators[1]}
        </Grid>
        <Grid
          xs={12}
          sm={4}
          md={3}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Amanecer hora={amanecer}></Amanecer>
          <Atardecer hora={atardecer}></Atardecer>
        </Grid>
      </Grid>

      <Grid xs={12} lg={2}>
        <ControlPanel listas={listas}></ControlPanel>
      </Grid>

      <BasicTable rows={rowsTable}></BasicTable>
    </>
  );
}

export default App;
