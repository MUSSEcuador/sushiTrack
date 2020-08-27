import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import {
  Grid,
  IconButton,
  Box,
  Typography,
  Tooltip,
  Modal,
} from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcCallIcon from "@material-ui/icons/AddIcCall";

import CallMotorizado from "./CallMotorizado";

const useStyles = makeStyles((theme) => ({
  withRoute: {
    margin: "0.5vh 0vw ",
    width: "99%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.primary.light,
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    position: "relative",
  },
  withoutRoute: {
    margin: "0.5vh 0vw",
    width: "99%",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
    backgroundColor: theme.palette.error.light,
    [theme.breakpoints.down("sm")]: {
      width: "80%",
    },
    position: "relative",
  },
  alerta: {
    position: "absolute",
    right: "4px",
    top: "4px",
    width: "35%",
    fontWeight: 500,
    fontSize: 11,
    color: theme.palette.secondary.dark,
    padding: "0.5vh 0 0 0",
    boxShadow: "2px 2px 5px rgb(100,100,100)",
  },
  vehTitle: {
    fontSize: 16,
    fontWeight: 800,
    paddingTop: "1vh",
    color: theme.palette.secondary.contrastText,
    marginBottom: "2vh",
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
  modal: {
    marginLeft: "30vw",
    marginTop: "20vh",
    marginRight: "30vw",
  },
}));

function LocalInfo(props) {
  const classes = useStyles();

  const { order, motorizados } = props;

  const [openInfo, setOpenInfo] = React.useState(false);

  const getLastUpdate = () => {
    if (order.lastUpdate) {
      let toTime = moment(order.lastUpdate).toLocaleString();
      toTime = toTime.split("G");
      toTime = toTime[0];
      return toTime;
    }
  };

  const calculateDelay = () => {
    let calc = moment.now() - moment(order.lastUpdate);
    let duration = moment.duration(calc).asMinutes();
    return duration;
  };

  const getDireccion = () => {
    let dir = "";
    if (order.address.principalStreet) {
      dir = dir + order.address.principalStreet + " ";
    }
    if (order.address.number) {
      dir = dir + order.address.number + " ";
    }
    if (order.address.secondaryStreet) {
      if (order.address.number) {
        dir = dir + order.address.secondaryStreet;
      } else dir = dir + " y " + order.address.secondaryStreet;
    }
    return dir;
  };

  const closeModal = () => {
    setOpenInfo(false);
  };
  return (
    <div>
      <Box
        className={
          calculateDelay() > 5 ? classes.withoutRoute : classes.withRoute
        }
      >
        {calculateDelay() > 5 ? (
          <p className={classes.alerta}>
            <span>No se ha actualizado en:</span>
            <br />
            <b>{+calculateDelay().toFixed(0)}</b>
            <span> minutos</span>
          </p>
        ) : null}

        <Typography className={classes.vehTitle}> {order.code}</Typography>
        <Typography align="left" className={classes.vehData}>
          <b>Local: </b>
          {" " + order.name}
        </Typography>
        {order.address ? (
          <div>
            <Typography align="justify" className={classes.vehData}>
              <b>Dirección: </b>
              {" " + getDireccion()}
            </Typography>
          </div>
        ) : null}
        <Typography align="left" className={classes.vehData}>
          <b>Ultima actualización: </b>
          {getLastUpdate()}
        </Typography>
        <Grid container spacing={4} className={classes.iconsList}>
          <Grid item xs={1}>
            <Tooltip
              title="Llamar a Motorizado"
              enterDelay={400}
              leaveDelay={200}
            >
              <InputAdornment position="start">
                <IconButton
                  className={classes.activo}
                  onClick={(e) => {
                    setOpenInfo(true);
                  }}
                >
                  <AddIcCallIcon />
                </IconButton>
              </InputAdornment>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      <Modal open={openInfo} onClose={closeModal} className={classes.modal}>
        <div>
          <CallMotorizado
            local={order}
            motorizados={motorizados}
            closeModal={closeModal}
          />
        </div>
      </Modal>
    </div>
  );
}

export default LocalInfo;
