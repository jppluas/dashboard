import * as React from "react";
import Datum from '../interfaces/Datum.tsx';

//Card
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea } from "@mui/material";

//Grid v2
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

//Radio Group
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

//Select
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function Calculator( {setPlan, setResult} ) {

  
  {/* Hooks: useState */}
  const [planId, setPlanId] = React.useState(-1);
  const [timeId, setTimeId] = React.useState(-1);
  const [menuItems, setMenuItems] = React.useState<Array<Datum>>([]);
  const [radioItems, setRadioItems] = React.useState<Array<Datum>>([]);


  {/* Hooks: useEffect */ }
	React.useEffect(() => {

    (async () => {

      const res = await fetch('https://raw.githubusercontent.com/aavendan/datos/main/tutoriales/planes.xml');
      const textXML = await res.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(textXML, "application/xml");

      const data = Array.from(xml.getElementsByTagName("item")).map(element => {
        return {
          "title": element.getElementsByTagName("title")[0].textContent,
          "subtitle": element.getElementsByTagName("subtitle")[0].textContent,
          "intro": element.getElementsByTagName("intro")[0].textContent,
          "description": element.getElementsByTagName("description")[0].textContent,
        }
      })

      setMenuItems(data)

      {/*const res = await fetch('https://raw.githubusercontent.com/aavendan/datos/main/tutoriales/planes.json');
      const data = await res.json();
      setMenuItems(data)*/}
    
    })();

    (async () => {
    
      const res = await fetch('https://raw.githubusercontent.com/aavendan/datos/main/tutoriales/tiempo.json');
      const data = await res.json();
      setRadioItems(data)
    
    })();

}, [])


  {
    /* Datos */
  }

  /* let menuItems = [
    {
      title: "Plan",
      subtitle: "100 Gb",
      intro:
        'El tipo de promoción "Plan" ofrece una estructura de precios y beneficios definida que se adapta a las necesidades específicas del cliente.',
      description:
        "Generalmente, este tipo de promoción está diseñado para aquellos que buscan un equilibrio entre costo y servicios, permitiendo elegir entre diferentes niveles de beneficios según el precio. ",
    },
    {
      title: "Suscripción",
      subtitle: "<100 Gb",
      intro:
        'Las promociones tipo "Suscripción" están orientadas a ofrecer un acceso continuo a servicios o productos mediante el pago de una cuota recurrente, que puede ser mensual, trimestral o anual.',
      description:
        "Este tipo de promoción es común en servicios digitales como plataformas de streaming, software, y publicaciones, así como en clubes o programas de membresía.",
    },
    {
      title: "Ilimitado",
      subtitle: ">100 Gb",
      intro:
        'La promoción "Ilimitado" se caracteriza por ofrecer acceso sin restricciones a los servicios incluidos, como datos móviles, minutos de llamada, o acceso a plataformas de streaming.',
      description:
        "Este tipo de promoción está diseñada para usuarios que tienen un alto consumo y prefieren no preocuparse por los límites mensuales.",
    },
  ];

  let radioItems = [
    {
      title: "1 mes",
      description:
        "Las promociones con una duración de 1 mes están diseñadas para brindar una experiencia a corto plazo y son ideales para clientes que buscan flexibilidad y no desean comprometerse a largo plazo. ",
    },
    {
      title: "6 meses",
      description:
        "Las promociones con una duración de 6 meses ofrecen un equilibrio entre compromiso y flexibilidad, proporcionando un periodo suficiente para que los usuarios disfruten de los beneficios.",
    },
    {
      title: "12 meses",
      description:
        "Las promociones de 12 meses están diseñadas para clientes que buscan un compromiso a largo plazo, generalmente acompañadas de los mayores beneficios y descuentos.",
    },
  ];
 */
  {
    /* Elementos renderizados */
  }

  let selectMenuItems = menuItems.map((element, key) => (
    <MenuItem key={key} value={key}>
      {element.title}
    </MenuItem>
  ));

  let radioGroupItems = radioItems.map(function (element, key) {
    return (
      <FormControlLabel
        key={element.title}
        value={key}
        control={<Radio />}
        label={element.title}
      />
    );
  });

  {
    /* JSX */
  }

   {/* Manejadores de eventos */}

   const handleChangeSelect = (event: SelectChangeEvent) => {
    let newMenuId = parseInt(event.target.value)
    setPlanId(newMenuId)

    /* Utiliza el nuevo índice para seleccionar un objeto en el arreglo */
    let newMenuItem = (newMenuId != -1)?menuItems[newMenuId]:null;

    /* Envía como parámetro un arreglo de cadenas de caracteres (atributos del objeto)  */
    setPlan([
      newMenuItem?.title, 
      newMenuItem?.subtitle, 
      newMenuItem?.description 
    ]);

  };

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newChangeId = parseInt((event.target as HTMLInputElement).value)
    setTimeId(newChangeId)
    
    /* Utiliza el nuevo índice para seleccionar un objeto en el arreglo */
    let newChageItem = (newChangeId != -1)?radioItems[newChangeId]:null;

    let month = (newChageItem?.title as String).substring(0,2)
    let subtotal = (parseInt(month)* 20).toString()
    let total = "$"+subtotal
    
    /* Envía como parámetro un arreglo de cadenas de caracteres (atributos del objeto) */
    setResult( [ newChageItem?.title, newChageItem?.description, total ])

  };
	{/* JSX */}

  return (
    <Card>
      <CardContent>
        <Typography gutterBottom component="h2" variant="h4" color="primary">
          Promociones del mes
        </Typography>

        <Grid container spacing={5}>
          <Grid xs={12} xl={6}>
            <Typography gutterBottom component="h4" color="secondary">
              Tipos de promociones
            </Typography>

            {/* Select */}

            <Select defaultValue="-1" sx={{ width: "35%" }} onChange={handleChangeSelect}>
              <MenuItem value="-1" disabled={true}>
                <em>Seleccione un tipo de promoción</em>
              </MenuItem>

              {/* Elementos renderizados */}

              {selectMenuItems}

              {/*<MenuItem key={0} value={0}>Plan</MenuItem>
		<MenuItem key={1} value={1}>Suscripción</MenuItem>
		<MenuItem key={2} value={2}>Ilimitado</MenuItem>*/}
            </Select>

            <p>
      	{(planId != -1)?menuItems[planId].intro:''}
     </p>

          </Grid>

          <Grid xs={12} xl={6}>
            <Typography gutterBottom component="h4" color="secondary">
              Tiempo de aplicación
            </Typography>

            {/* Radio Group */}
            <RadioGroup
              name="radio-buttons-group"
              sx={{
                marginLeft: "2%",
              }}
              onChange={handleChangeRadio}
            >
              {/* Elementos renderizados */}

              {radioGroupItems}

              {/*<FormControlLabel key={0} value={0} control={<Radio />} label="1 mes" />
		<FormControlLabel key={1} value={1} control={<Radio />} label="6 meses" />
		<FormControlLabel key={2} value={2} control={<Radio />} label="12 meses" />*/}
            </RadioGroup>

            <p>
      {(timeId != -1)?radioItems[timeId].description:''}
    </p>

          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
