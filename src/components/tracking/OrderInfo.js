import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Typography, Link, Modal } from "@material-ui/core";

import EsperaInfo from "./EsperaInfo";

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    height: "50vh",
    width: "40vw",
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.primary.light,
    textAlign: "center",
  },
  titleContainer:{
    backgroundColor: theme.palette.primary.main,
    height: "15%",
    paddingTop: "1vh"
  },
  contentContainer:{
    padding: "1vh 2vw",
  },
  title: {
    padding: "2vh 0",
    color: theme.palette.secondary.light,
    fontWeight: 300,
    fontSize: "2em",
    [theme.breakpoints.down("sm")]: {
      fontWeight: 500,
      fontSize: "1.5em",
    },
  },
  divisionText: {
    padding: "1vh",
    color: theme.palette.secondary.contrastText,
    textDecoration: "underline",
    fontSize: "1.3em",
    fontWeight: 700
  },
  subtitle: {
    padding: "1vh",
    color: theme.palette.secondary.contrastText,
    fontWeight: 100,
    fontSize: "1.2em",
  },
  modal:{
    marginLeft: "35vw",
    marginTop:"30vh",
    marginRight: "35vw"
  }
}));

function OrderInfo(props) {
  const { name, order, ordersAssigned } = props;
  const classes = useStyles();

  const [openEspera, setOpenEspera] = React.useState(false);
  const [esperaToShow, setEsperaToShow] = React.useState({});

  const closeEspera = () =>{
    setOpenEspera(false)
  }

  console.log(order, ordersAssigned);

  const getDireccion = () => {
    let dir = "";
    if (order.principalStreet) {
      dir = dir + order.principalStreet + " ";
    }
    if (order.number) {
      dir = dir + order.number + " ";
    }
    if (order.secondaryStreet) {
      if (order.number) {
        dir = dir + order.secondaryStreet;
      } else dir = dir + " y " + order.secondaryStreet;
    }
    return dir;
  };

  const getEsperaToShow = (id) =>{
    const found = ordersAssigned.find((d)=>d.tripId === id);
    if (found)
    {
     setEsperaToShow(found)
    }
    setOpenEspera(true)
  }

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
      <Typography className={classes.title} align="center">
        {name}
      </Typography>
      </div>
      <div className={classes.contentContainer}>
      <Typography className={classes.divisionText}>ORDEN ACTUAL</Typography>
      <Typography align="justify" className={classes.subtitle}>
          <b>Identificador:</b> {" " + order.tripId}
        </Typography>
      <Typography align="justify" className={classes.subtitle}>
        <b>Cliente:</b> {" " + order.name + " " + order.lastName}
      </Typography>
      {order.sector ? (
        <Typography align="justify" className={classes.subtitle}>
          <b>Sector:</b> {" " + order.sector}
        </Typography>
      ) : null}
      {order.principalStreet ? (
        <Typography align="justify" className={classes.subtitle}>
          <b>Dirección:</b> {getDireccion()}
        </Typography>
      ) : null}
      {order.cellphone ? (
        <Typography align="justify" className={classes.subtitle}>
          <b>Teléfono:</b> {" " + order.cellphone}
        </Typography>
      ) : null}
      <Typography className={classes.divisionText}>
        ORDENES EN ESPERA
      </Typography>
      {ordersAssigned.map((asigned, index) => {
        return (
          <Typography align="justify" className={classes.subtitle} key={index}>
            <Link onClick={(e)=>{getEsperaToShow(asigned.tripId)}}>
            <b>Orden:</b> {" " + asigned.tripId + " - " + asigned.name + " " + asigned.lastName}
            </Link>
          </Typography>
        );
      })}
      </div>
      <Modal open={openEspera} onClose={closeEspera} className={classes.modal}>
        <div>
  
          <EsperaInfo ordersAssigned={esperaToShow} />
        </div>
      </Modal>
    </div>
  );
}

export default OrderInfo;
