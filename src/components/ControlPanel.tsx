import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState, useRef } from "react";
import WeatherChart from "./WeatherChart";
import Grid from '@mui/material/Grid'; 

interface Config {
  listas: Array<Array<Array<string | number>>>;
}

export default function ControlPanel({ listas }: Config) {
  const [chartData, setChartData] = useState<(string | number)[][]>([]);
  const [tituloElegido, setTituloElegido] = useState<{ title: string; curveType: string }>({ title: "", curveType: "" });
  const [selected, setSelected] = useState(-1);

  const descriptionRef = useRef<HTMLDivElement>(null);

  const precipitacionesTitle = {
    title: "Precipitación vs Hora",
    curveType: "function",
  };
  const humedadesTitle = {
    title: "Humedad vs Hora",
    curveType: "function",
  };
  const nubosidadesTitle = {
    title: "Nubosidad vs Hora",
    curveType: "function",
  };
  const temperaturasTitle = {
    title: "Temperatura vs Hora",
    curveType: "function",
  };
  const visibilidadesTitle = {
    title: "Visibilidad vs Hora",
    curveType: "function",
  };

  const titulos = [
    precipitacionesTitle,
    humedadesTitle,
    nubosidadesTitle,
    temperaturasTitle,
    visibilidadesTitle,
  ];

  const descripciones = [
    {
      name: "Precipitación",
      description:
        "Cantidad de agua, en forma de lluvia, nieve o granizo, que cae sobre una superficie en un período específico.",
    },
    {
      name: "Humedad",
      description:
        "Cantidad de vapor de agua presente en el aire, generalmente expresada como un porcentaje.",
    },
    {
      name: "Nubosidad",
      description:
        "Grado de cobertura del cielo por nubes, afectando la visibilidad y la cantidad de luz solar recibida.",
    },
    {
      name: "Temperatura",
      description:
        "Medida de la energía cinética promedio de las partículas de un sistema, generalmente expresada en grados Celsius.",
    },
    {
      name: "Visibilidad",
      description:
        "Distancia máxima a la que un objeto o luz es visible, afectada por la presencia de niebla, humo, polvo o precipitación.",
    },
  ];

  const cantidades = [
    {
      name: "1 Día",
      cantidad: 8,
    },
    {
      name: "2 Días",
      cantidad: 16,
    },
    {
      name: "3 Días",
      cantidad: 24,
    },
    {
      name: "4 Días",
      cantidad: 32,
    },
    {
      name: "5 Días",
      cantidad: 40,
    },
  ];

  const options = descripciones.map((item, key) => (
    <MenuItem key={key} value={key}>
      {item.name}
    </MenuItem>
  ));

  const options2 = cantidades.map((item, key) => (
    <MenuItem key={key} value={key}>
      {item.name}
    </MenuItem>
  ));

  const handleChange = (event: SelectChangeEvent) => {
    const idx = parseInt(event.target.value);
    setSelected(idx);

    if (descriptionRef.current !== null) {
      descriptionRef.current.innerHTML = idx >= 0 ? descripciones[idx].description : "";
    }

    setChartData(listas[idx].slice(0, 8));
    setTituloElegido(titulos[idx]);
  };

  const handleChange2 = (event: SelectChangeEvent) => {
    const idx2 = parseInt(event.target.value);

    if (selected >= 0) {
      setChartData(listas[selected].slice(0, cantidades[idx2].cantidad));
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography mb={2} component="h3" variant="h6" color="primary">
          Graficos meteorológicos
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="simple-select-label">Variables</InputLabel>
                <Select
                  labelId="simple-select-label"
                  id="simple-select"
                  label="Variables"
                  defaultValue="-1"
                  onChange={handleChange}
                >
                  <MenuItem key="-1" value="-1" disabled>
                    Seleccione una variable meteorológica
                  </MenuItem>

                  {options}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          <Grid item xs={4}>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="simple-select-label">Cantidad de datos</InputLabel>
                <Select
                  labelId="simple-select-label"
                  id="simple-select"
                  label="Cantidad de datos"
                  defaultValue="0"
                  onChange={handleChange2}
                >
                  <MenuItem key="-1" value="-1" disabled>
                    Seleccione la cantidad de datos a mostrar
                  </MenuItem>

                  {options2}
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>

        <Typography
          ref={descriptionRef}
          mt={2}
          component="p"
          color="text.secondary"
        />
      </Paper>

      {chartData.length > 0 ? <WeatherChart titulo={tituloElegido} info={chartData} /> : null}
    </>
  );
}
