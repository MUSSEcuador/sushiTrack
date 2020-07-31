import React from 'react';

import { makeStyles } from "@material-ui/core/styles";

import {
  Grid,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
import LocationOnIcon from "@material-ui/icons/LocationOn";

const useStyles = makeStyles((theme) => ({
    box: {
      margin: "0.5vh 0vw 0.5vh 2vw",
      width: "90%",
      boxShadow: "2px 2px 5px rgb(100,100,100)",
      backgroundColor: theme.palette.primary.light,
      [theme.breakpoints.down("sm")]: {
          width: "80%",
      },
    },
    vehTitle: {
      fontSize: 16,
      paddingTop: "1vh",
      color: theme.palette.primary.contrastText
    },
    vehTime: {
      fontSize: 13,
      margin: "1vh 2vw",
      color: "rgb(255,255,255)"
    },
    activo: {
      color: theme.palette.secondary.main,
    },
    iconsList: {
      marginTop: "2px",
      marginBottom: "2px",
      paddingLeft: "1vw",
    },
  }));
  

function MotorizadoInfo(props) {
    const classes = useStyles();

    const {veh, recenter} = props;

    return (
        <Box className={classes.box}>
                    <Typography className={classes.vehTitle}>
                      {" "}
                      {veh.motorizado.name } / {veh.motorizado.placa}
                    </Typography>
                    <Typography align="justify" className={classes.vehTime}>
                      {veh.sector}
                    </Typography>
                    <Grid container spacing={4} className={classes.iconsList}>
                      <Grid item xs={1}>
                        <Tooltip
                          title="Veh. Info."
                          enterDelay={400}
                          leaveDelay={200}
                        >
                          <InputAdornment position="start">
                            <IconButton
                              className={classes.activo}
                              onClick={(e) => {
                                console.log(e.target.value)
                              }}
                            >
                              <AirportShuttleIcon />
                            </IconButton>
                          </InputAdornment>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Ir a" enterDelay={600} leaveDelay={150}>
                          <InputAdornment position="start">
                            <IconButton
                              className={classes.activo}
                              onClick={(e) => {
                                console.log(veh)
                              }}
                            >
                              <LocationOnIcon />
                            </IconButton>
                          </InputAdornment>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Ruta" enterDelay={400} leaveDelay={200}>
                          <InputAdornment position="start">
                            <IconButton className={classes.activo}>
                              <DeviceHubIcon />
                            </IconButton>
                          </InputAdornment>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={1}>
                        <Tooltip
                          title="Ver en pantalla"
                          enterDelay={400}
                          leaveDelay={200}
                        >
                          <InputAdornment position="start">
                            <IconButton
                              className={classes.activo}
                              onClick={(e) => {
                                e.preventDefault();
                                recenter(veh)
                                
                              }}
                            >
                              {
                                <VisibilityIcon />
                              }
                            </IconButton>
                          </InputAdornment>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Box>
    )
}

export default MotorizadoInfo
