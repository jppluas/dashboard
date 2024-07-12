import * as React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Calculator from "./components/Calculator";
import Plan from "./components/Plan";
import Result from "./components/Result";
import Indicator from "./components/Indicator";
import Summary from "./components/Summary";
import ControlPanel from "./components/ControlPanel";
import WeatherChart from "./components/WeatherChart";
import BasicTable from "./components/BasicTable";

import "./App.css";

function App() {
  {
    /* Hooks: useState */
  }
  const [plan, setPlan] = React.useState(new Array<String>());
  const [result, setResult] = React.useState(new Array<String>());


  {
    /* Callbacks */
  }
  const getPlan = (msgPlan: Array<String>) => {
    setPlan(msgPlan);
  };

  const getResult = (msgResult: Array<String>) => {
    setResult(msgResult);
  };

  

  {
    /* 
         1. Agregue la variable de estado (dataTable) y función de actualización (setDataTable).
     */
  }

  const [count, setCount] = useState(0);
  let [rowsTable, setRowsTable] = useState([]);
  let [indicators, setIndicators] = useState([]);
  let [listas, setListas] = useState([]);
  
  var precipitaciones = [["Hora", "Precipitación"]];
  var humedades = [["Hora", "Humedad"]];
  var nubosidades = [["Hora", "Nubosidad"]];
  var temperaturas = [["Hora", "Temperatura"]];
  var visibilidades = [["Hora", "Visibilidad"]];

  

  {
    /* Hook: useEffect */
  }

  useEffect(() => {
    (async () => {
      let savedTextXML = "";

      {
        /* Del LocalStorage, obtiene el valor de las claves openWeatherMap y expiringTime */
      }

      savedTextXML = localStorage.getItem("openWeatherMap");
      let expiringTime = localStorage.getItem("expiringTime");

      {
        /* Estampa de tiempo actual */
      }

      let nowTime = new Date().getTime();

      {
        /* Realiza la petición asicrónica cuando: 
				(1) La estampa de tiempo de expiración (expiringTime) es nula, o  
				(2) La estampa de tiempo actual es mayor al tiempo de expiración */
      }

      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        {
          /* Request */
        }

        let API_KEY = "c45a8618fc83e03c7355f428f9ffa221";
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`
        );
        savedTextXML = await response.text();

        {
          /* Diferencia de tiempo */
        }

        let hours = 1;
        let delay = hours * 3600000;

        {
          /* En el LocalStorage, almacena texto en la clave openWeatherMap y la estampa de tiempo de expiración */
        }

        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", (nowTime + delay).toString());
      }

      {
        /* XML Parser */
      }

      const parser = new DOMParser();
      const xml = parser.parseFromString(savedTextXML, "application/xml");

      {
        /* Arreglo para agregar los resultados */
      }

      let dataToIndicators = new Array();

      {
        /* 
			Análisis, extracción y almacenamiento del contenido del XML 
			en el arreglo de resultados
		*/
      }

      let ciudad = xml.getElementsByTagName("name")[0].innerHTML;

      let location = xml.getElementsByTagName("location")[1];

      let geobaseid = location.getAttribute("geobaseid");
      dataToIndicators.push([ciudad, "geobaseid", geobaseid]);

      let latitude = location.getAttribute("latitude");
      dataToIndicators.push([ciudad, "Latitude", latitude]);

      let longitude = location.getAttribute("longitude");
      dataToIndicators.push([ciudad, "Longitude", longitude]);

      /* 		console.log( dataToIndicators )
       */

      {
        /* Renderice el arreglo de resultados en un arreglo de elementos Indicator */
      }

      let indicatorsElements = Array.from(dataToIndicators).map((element) => (
        <Indicator
          title={element[0]}
          subtitle={element[1]}
          value={element[2]}
        />
      ));

      {
        /* Modificación de la variable de estado mediante la función de actualización */
      }

      setIndicators(indicatorsElements);

      {
        /* 
                 2. Procese los resultados de acuerdo con el diseño anterior.
                 Revise la estructura del documento XML para extraer los datos necesarios. 
             */
      }

      let vientos = Array.from(xml.getElementsByTagName("time")).map(
        (timeElement) => {
          let rangeHours =
            timeElement.getAttribute("from").split("T")[1] +
            " - " +
            timeElement.getAttribute("to").split("T")[1];

          let windDirection =
            timeElement
              .getElementsByTagName("windDirection")[0]
              .getAttribute("deg") +
            " " +
            timeElement
              .getElementsByTagName("windDirection")[0]
              .getAttribute("code");

          return { rangeHours: rangeHours, windDirection: windDirection };
        }
      );

      vientos = vientos.slice(0, 8);

      {
        /* 3. Actualice de la variable de estado mediante la función de actualización */
      }

      setRowsTable(vientos);

      

      const kelvinToCelsius = (kelvin) => kelvin - 273.15;

      Array.from(xml.getElementsByTagName("time")).map((timeNode) => {
        const from = timeNode.getAttribute("from");
        const temperatureNode = timeNode.getElementsByTagName("temperature")[0];
        const humidityNode = timeNode.getElementsByTagName("humidity")[0];
        const precipitationNode =
          timeNode.getElementsByTagName("precipitation")[0];
        const cloudsNode = timeNode.getElementsByTagName("clouds")[0];
        const visibilityNode = timeNode.getElementsByTagName("visibility")[0];

        const temperatura = kelvinToCelsius(
          parseInt(temperatureNode.getAttribute("value"))
        );
        const precipitacion = parseInt(
          precipitationNode.getAttribute("probability")
        );
        const humedad = parseInt(humidityNode.getAttribute("value"));
        const nubosidad = parseInt(cloudsNode.getAttribute("all"));
        const visibilidad = parseInt(visibilityNode.getAttribute("value"));
        const hora =
          new Date(from).getHours() + ":" + new Date(from).getMinutes();

        temperaturas.push([hora, temperatura]);
        precipitaciones.push([hora, precipitacion]);
        humedades.push([hora, humedad]);
        nubosidades.push([hora, nubosidad]);
        visibilidades.push([hora, visibilidad]);
      });
      
      setListas([precipitaciones, humedades,nubosidades, temperaturas,  visibilidades]);

    })();
  }, []);




  return (
    <>
      <Grid container spacing={5}>
        <Grid xs={12} sm={4} md={3} lg={2}>
          {indicators[0]}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>
          {indicators[1]}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>
          {indicators[2]}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>
          <Indicator
            title="Precipitación"
            subtitle="Probabilidad"
            value={0.13}
          />
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>
          <Indicator
            title="Precipitación"
            subtitle="Probabilidad"
            value={0.13}
          />
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>
          <Indicator
            title="Precipitación"
            subtitle="Probabilidad"
            value={0.13}
          />
        </Grid>
        {/* <Summary></Summary> */}
      </Grid>

      <BasicTable rows={rowsTable}></BasicTable>

      <Grid xs={12} lg={2}>
        <ControlPanel listas = {listas}></ControlPanel>
      </Grid>
      
    </>
  );
}

export default App;
