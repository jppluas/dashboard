import * as React from "react";
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Calculator from "./components/Calculator";
import Plan from "./components/Plan";
import Result from "./components/Result";
import Indicator from './components/Indicator';
import Summary from './components/Summary';
import ControlPanel from './components/ControlPanel';
import WeatherChart from './components/WeatherChart';
import BasicTable from './components/BasicTable';

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

  const [count, setCount] = useState(0);

  {
    /* 
         1. Agregue la variable de estado (dataTable) y función de actualización (setDataTable).
     */
  }

  let [rowsTable, setRowsTable] = useState([]);

  {
    /* Variable de estado y función de actualización */
  }

  let [indicators, setIndicators] = useState([]);

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

      let arrayObjects = Array.from(xml.getElementsByTagName("time")).map(
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

      arrayObjects = arrayObjects.slice(0, 8);

      {
        /* 3. Actualice de la variable de estado mediante la función de actualización */
      }

      setRowsTable(arrayObjects);
    })();
  }, []);

  return (
    <>
      <Grid container spacing={5}>
        <Grid xs={12} sm={4} md={3} lg={2}>
          {indicators[0]}
          {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>
          {indicators[1]}
          {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
        </Grid>
        <Grid xs={12} sm={4} md={3} lg={2}>
          {indicators[2]}
          {/* <Indicator title='Precipitación' subtitle='Probabilidad' value={0.13} /> */}
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
        <Summary></Summary>
      </Grid>

      <BasicTable rows={rowsTable}></BasicTable>

      <Grid xs={12} lg={2}>
        <ControlPanel />
      </Grid>
      <Grid xs={12} lg={10}>
        <WeatherChart></WeatherChart>
      </Grid>

      <Grid container spacing={5}>
        {/* Calculator */}
        <Grid xs={12} sm={12} md={12} lg={12}>
          <Calculator setPlan={getPlan} setResult={getResult} />
        </Grid>

        {/* Plan */}
        <Grid xs={12} sm={6} md={6} lg={6}>
          {plan.length > 0 ? (
            <Plan title={plan[0]} subtitle={plan[1]} description={plan[2]} />
          ) : (
            <></>
          )}
        </Grid>

        {/* Result */}
        <Grid xs={12} sm={6} md={6} lg={6}>
          {plan.length > 0 && result.length > 0 ? (
            <Result
              title={result[2]}
              subtitle={result[0]}
              description={plan[0] + " " + plan[1]}
            />
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </>
  );
}

export default App;
