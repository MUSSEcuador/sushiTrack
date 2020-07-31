import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {Select, MenuItem, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
    width: "80vw",
    marginTop: "10vh",
    marginLeft: "10vw",
    color: theme.palette.secondary.main,
    backgroundColor: "white",
    padding: "10vh 5vw"
  },
  title:{
    fontWeight: "900",
    fontSize: "1.5em", 
    marginBottom: "5vh"
  },
  menuItem:{
    color: theme.palette.primary.contrastText,
    fontSize: "1em", 
  }
}));

function CallMotorizado(props) {
  const classes = useStyles();

  const {motorizados} = props;

  return(
  <div className={classes.root}>
    <Typography className={classes.title} align="center">
      Selecciona el motorizado al que deseas llamar
    </Typography>
    <Select
      fullWidth
      variant="outlined"
      className={classes.selectMotorizado}
      onChange={(e) => {
        //setUnidadSelected(e, producto);
      }}
    >
      {motorizados.map((moto) => {
        return (
          <MenuItem
            className={classes.menuItem}
            value={moto}
            key={moto.id}
          >
            {moto.name}
          </MenuItem>
        );
      })}
    </Select>
  </div>
  )
}

export default CallMotorizado;
