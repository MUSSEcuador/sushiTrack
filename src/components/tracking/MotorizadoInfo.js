import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { Grid, IconButton, Box, Typography, Tooltip, Modal} from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import AirportShuttleIcon from "@material-ui/icons/AirportShuttle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import DeviceHubIcon from '@material-ui/icons/DeviceHub';

import OrderInfo from "./OrderInfo";

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
    fontWeight: 800,
    paddingTop: "1vh",
    color: theme.palette.secondary.contrastText,
  },
  vehData: {
    fontSize: 13,
    margin: "1vh 0 1vh 1vw",
    color: theme.palette.secondary.contrastText,
  },
  activo: {
    color: theme.palette.secondary.main,
  },
  iconsList: {
    marginTop: "2px",
    marginBottom: "2px",
    paddingLeft: "1vw",
  },
  modal:{
    marginLeft: "30vw",
    marginTop:"20vh",
    marginRight: "30vw"
  }
}));

function MotorizadoInfo(props) {
  const classes = useStyles();

  const { order, recenter, destinoCenter ,showOrderRoute } = props;

  const [openInfo, setOpenInfo] = React.useState(false);
  let lastUpdateSplitted = order.lastUpdate.split("T");
  const fecha = lastUpdateSplitted[0];
  lastUpdateSplitted = lastUpdateSplitted[1].split(".");
  const hora =lastUpdateSplitted[0]; 

  const closeModal = () => {
    setOpenInfo(false);
  };
  console.log(order, fecha, hora);
  return (
    <div>
      <Box className={classes.box}>
        <Typography className={classes.vehTitle}>
          {" "}
          {order.delivery}
        </Typography>
        <Typography align="left" className={classes.vehData}>
          <b>Identificador: </b>{" " + order.receipment.tripId}
        </Typography>
        <Typography align="left" className={classes.vehData}>
          <b>Ultima actualización: </b>{" " + fecha + " " + hora}
        </Typography>
        <Typography align="justify" className={classes.vehData}>
          <b>Ordenes en espera: </b>{" " + order.remainOrdersAssigned}
        </Typography>
        <Grid container spacing={4} className={classes.iconsList}>
          <Grid item xs={1}>
            <Tooltip title="Detalle" enterDelay={400} leaveDelay={200}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    console.log(e.target.value);
                    setOpenInfo(true);
                  }}
                >
                  <AirportShuttleIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Ruta" enterDelay={600} leaveDelay={150}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    e.preventDefault();
                    showOrderRoute(order);
                  }}
                >
                  <DeviceHubIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Ub. Actual" enterDelay={600} leaveDelay={150}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    e.preventDefault();
                    recenter(order);
                  }}
                >
                  <LocationOnIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Destino" enterDelay={400} leaveDelay={200}>
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    e.preventDefault();
                    destinoCenter(order);
                  }}
                >
                  {<VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      <Modal open={openInfo} onClose={closeModal} className={classes.modal}>
        <div>
          <OrderInfo name={order.delivery} order={order.receipment} ordersAssigned={order.ordersAssigned} />
        </div>
      </Modal>
    </div>
  );
}

export default MotorizadoInfo;
