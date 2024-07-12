import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

import sunrise from '../assets/images/atardecer.jpg'

interface Config {
    hora: string;
}

export default function Atardecer( {hora}: Config) {
    return (
        <Card sx={{
          m: 2,
          p: 2,
        }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="300"
                    width="300"
                    image={sunrise}
                    alt="Atardecer"
                />
                <CardContent>
                    <Typography gutterBottom component="h2" variant="h6" color="primary">
                    Atardecer
                    </Typography>
                    <Typography component="p" variant="h4">
                       {hora}
                    </Typography>
                    
                </CardContent>
            </CardActionArea>
        </Card>
    )
}