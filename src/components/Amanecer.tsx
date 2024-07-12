import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

interface Config {
    hora: string;
    imagen: string;
}

export default function Amanecer( {hora, imagen}: Config) {
    return (
        <Card sx={{
          m: 2,
          p: 2,
          backgroundColor: '#ceffe2'
        }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="300"
                    width="300"
                    image={imagen}
                    alt="Amanecer"
                />
                <CardContent>
                    <Typography gutterBottom component="h2" variant="h6" color="primary">
                        Amanecer
                    </Typography>
                    <Typography component="p" variant="h4">
                        {hora}
                    </Typography>
                    
                </CardContent>
            </CardActionArea>
        </Card>
    )
}