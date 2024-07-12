import { Chart } from "react-google-charts";
import Paper from '@mui/material/Paper'; 

interface Config {
    info: Array<Array<string | number>>;
    titulo: Object;
}

export default function WeatherChart({ titulo, info  }: Config) {


    return (
		<Paper
			sx={{
				p: 2,
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<Chart
				chartType="LineChart"
				data={info}
				width="100%"
				height="400px"
				options={titulo}
		/>
		</Paper>
    )
}	