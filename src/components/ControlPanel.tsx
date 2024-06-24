import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState, useRef } from 'react';

export default function ControlPanel() {

    {/* Variable de estado y función de actualización */}

	let [selected, setSelected] = useState(-1);

    {/* Variable de referencia a un elemento */ }

    const descriptionRef = useRef<HTMLDivElement>(null);

  {
    /* Datos de los elementos del Select */
  }

  let items = [
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
  ];

  let options = items.map((item, key) => (
    <MenuItem key={key} value={key}>
      {item["name"]}
    </MenuItem>
  ));

  {/* Manejador de eventos */}

	const handleChange = (event: SelectChangeEvent) => {

		let idx = parseInt(event.target.value)
		setSelected( idx );

		{/* Modificación de la referencia */}

		if (descriptionRef.current !== null) {
			descriptionRef.current.innerHTML = (idx >= 0) ? items[idx]["description"] : ""
		}

	};

  {
    /* JSX */
  }

  return (
    <Paper
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography mb={2} component="h3" variant="h6" color="primary">
        Variables Meteorológicas
      </Typography>

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
              Seleccione una variable
            </MenuItem>

            {options}
          </Select>
        </FormControl>
      </Box>
      {/* Muestra la descripción de la variable seleccionada */}
			<Typography ref={descriptionRef} mt={2} component="p" color="text.secondary" />
			
    </Paper>
  );
}
