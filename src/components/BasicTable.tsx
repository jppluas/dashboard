import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface Row {
  rangeHours: string;
  windDirection: string;
}

interface Config {
  rows: Row[];
}

export default function BasicTable(data: Config) {
  let [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    setRows(data.rows);
  }, [data]);

  return (
    <Paper sx={{ mt: 5, mb: 5, p: 2, display: "flex", flexDirection: "column" }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Dirección del viento
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Rango de horas</TableCell>
              <TableCell align="right">Dirección del viento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.rangeHours}>
                <TableCell component="th" scope="row">
                  {row.rangeHours}
                </TableCell>
                <TableCell align="right">{row.windDirection}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
