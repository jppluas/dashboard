import { useState, useEffect } from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Indicator from "./components/Indicator";
import Atardecer from "./components/Atardecer";
import Amanecer from "./components/Amanecer";
import ControlPanel from "./components/ControlPanel";
import BasicTable from "./components/BasicTable";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

import "./App.css";

function App() {
  let [rowsTable, setRowsTable] = useState<
    { rangeHours: string; windDirection: string }[]
  >([]);
  let [indicators, setIndicators] = useState<JSX.Element[]>([]);
  let [listas, setListas] = useState<any[][]>([]);
  let [amanecer, setAmanecer] = useState<string>("");
  let [atardecer, setAtardecer] = useState<string>("");
  let [city, setCity] = useState<string>("Guayaquil");
  let [cityBase, setCityBase] = useState<string>("Guayaquil");
  let [pais, setPais] = useState<string>("EC");
  let [citySunriseImage, setCitySunriseImage] = useState<string>("");
  let [citySunsetImage, setCitySunsetImage] = useState<string>("");

  var precipitaciones: Array<[any, any]> = [["Hora", "Precipitación"]];
  var humedades: Array<[any, any]> = [["Hora", "Humedad"]];
  var nubosidades: Array<[any, any]> = [["Hora", "Nubosidad"]];
  var temperaturas: Array<[any, any]> = [["Hora", "Temperatura"]];
  var visibilidades: Array<[any, any]> = [["Hora", "Visibilidad"]];

  const [ultimaUpdate, setUltimaUpdate] = useState<string>("");

  const loadCityImage = async (ciudad: string) => {
    const UNSPLASH_ACCESS_KEY = '7QIR0cG_4iGb75k5FYUrAfhn-A4r0uJ8iOpOaMJkrCk'; // Reemplaza con tu clave de API de Unsplash
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: `${ciudad} amanecer alegre mañana desayuno`, client_id: UNSPLASH_ACCESS_KEY, per_page: 5 },
      });
      const aleatorio = Math.floor(Math.random() * 5);
      const imageUrl = response.data.results[aleatorio]?.urls?.regular;
      setCitySunriseImage(imageUrl || '');
    } catch (error) {
      console.error("Error fetching image from Unsplash", error);
    }
    
    try {
      const response = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: `${ciudad} atardecer sunset alegre cena fiesta `, client_id: UNSPLASH_ACCESS_KEY, per_page: 5 },
      });
      const aleatorio = Math.floor(Math.random() * 5);
      const imageUrl = response.data.results[aleatorio]?.urls?.regular;
      setCitySunsetImage(imageUrl || '');
    } catch (error) {
      console.error("Error fetching image from Unsplash", error);
    }
  };
  
  const handleChangeCity = (event: React.ChangeEvent<HTMLInputElement>) => {

      setCityBase(event.target.value.replace(/\s/g, '+'));      
    };

  const loadNuevaCiudad = (ciudadNueva:string) => {
    (async () => {
      let savedTextXML = localStorage.getItem("openWeatherMap");
      let expiringTime = localStorage.getItem("expiringTime");
      let currentTime = localStorage.getItem("currentTime");

      let nowTime = new Date().getTime();

      if (
        expiringTime === null ||
        nowTime > parseInt(expiringTime) ||
        currentTime === null ||
        ciudadNueva !== localStorage.getItem("currentCity")
      ) {
        let API_KEY = "c45a8618fc83e03c7355f428f9ffa221";
        let response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${ciudadNueva.toString()}&mode=xml&appid=${API_KEY}`
        );
        savedTextXML = await response.text();

        let hours = 1;
        let delay = hours * 3600000;

        localStorage.setItem("openWeatherMap", savedTextXML);
        localStorage.setItem("expiringTime", (nowTime + delay).toString());
        localStorage.setItem("currentCity", ciudadNueva.toString());

        let currentTime = new Date().toLocaleTimeString();
        localStorage.setItem("currentTime", currentTime);
        setUltimaUpdate(currentTime);
      }

      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        let dataToIndicators: Array<[string, string, string]> = [];

        setCity(cityBase);

        let ciudad = xml.getElementsByTagName("name")[0].innerHTML;
        let location = xml.getElementsByTagName("location")[1];

        let latitude = location.getAttribute("latitude")!;
        dataToIndicators.push([ciudad, "Latitud", latitude]);

        let longitude = location.getAttribute("longitude")!;
        dataToIndicators.push([ciudad, "Longitud", longitude]);

        setPais(xml.getElementsByTagName("country")[0].innerHTML);

        setUltimaUpdate(currentTime || "");
        const sunsetTime = xml.querySelector("sun")?.getAttribute("set");
        const sunriseTime = xml.querySelector("sun")?.getAttribute("rise");

        if (sunsetTime) {
          const sunsetDate = new Date(sunsetTime);
          sunsetDate.setHours(sunsetDate.getHours() - 5);
          setAtardecer(sunsetDate.toLocaleTimeString());
        } else {
          // Handle the case where sunsetTime is null
          setAtardecer("N/A"); // Or any default/fallback value
        }
        
        if (sunriseTime) {
          const sunriseDate = new Date(sunriseTime);
          sunriseDate.setHours(sunriseDate.getHours() - 5);
          setAmanecer(sunriseDate.toLocaleTimeString());
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

    loadCityImage(ciudadNueva);

  };

  useEffect(() => {
    loadNuevaCiudad(city);
  }, []);

  return (
    <>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: 2,
        }}
      >
        <FormControl>
          <TextField
            label="Ciudad"
            variant="outlined"
            onChange={handleChangeCity}
          />
          <Button
          sx = {{m: 1 , backgroundColor: "#b0d0f5",}} 
            variant= "outlined"
            onClick={() => loadNuevaCiudad(cityBase)}
            >
              Cambiar Ciudad </Button>
        </FormControl>
      </Box>

      <h1>{city.split('+').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}, {pais}</h1>

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
          <Amanecer hora={amanecer} imagen= {citySunriseImage}></Amanecer>
          <Atardecer hora={atardecer} imagen= {citySunsetImage}></Atardecer>
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
