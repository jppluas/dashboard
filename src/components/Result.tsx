import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardActionArea } from '@mui/material';
import Datum from '../interfaces/Datum.tsx';


export default function Result(data: Datum)  {
    return (
        <Card>
            <CardActionArea>
                <CardContent>
                    <Typography gutterBottom component="h2" variant="h6" color="primary">
                        {data.subtitle}
                    </Typography>
                    <Typography component="p" variant="h4">
                        {data.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ flex: 1 }}>
                        {data.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}