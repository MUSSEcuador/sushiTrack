import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Divider } from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
  title: {
    padding: "1vh 0 0 0",
    color: theme.palette.secondary.contrastText,
    fontWeight: 900,
    fontSize: "1.2em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em",
    },
  },
  divisionText: {
    backgroundColor: theme.palette.secondary.contrastText,
    margin: "1vh 0 0 0",
  },
  subtitle: {
    padding: "0 1vw",
    color: theme.palette.secondary.contrastText,
    fontWeight: 100,
    fontSize: "1em",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7em",
    },
  },
}));


function SinAsignar(props) {
  const classes = useStyles();

  const {ordersWithError} = props;

  const getDireccion = (order) => {
    let dir = "";
    if (order.order.clientAddress.principalStreet) {
      dir = dir + order.order.clientAddress.principalStreet + " ";
    }
    if (order.order.clientAddress.number) {
      dir = dir + order.order.clientAddress.number + " ";
    }
    if (order.order.clientAddress.secondaryStreet) {
      if (order.order.clientAddress.number) {
        dir = dir + order.order.clientAddress.secondaryStreet;
      } else dir = dir + " y " + order.order.clientAddress.secondaryStreet;
    }
    return dir;
  };

  return (
    <div>
      {props.ordersWithError?.length >0?
      <Typography>ORDENES NO ATENDIDAS</Typography>
      :null}
        
      {props.ordersWithError.map((order) => {
        return (
          <div key={order.id}>
            <Typography className={classes.title} align="center">
              {"Orden #: " + order.order.transact}
            </Typography>
            {order.deliveryId?
            
            <Typography align="justify" className={classes.subtitle}>
              <b>Rechazada por:</b>{" "}
              {" " + order.deliveryId}
            </Typography>
            :null
          }
            {order.order.client?
            
              <Typography align="justify" className={classes.subtitle}>
                <b>Cliente:</b>{" "}
                {" " + order.order.client.name + " "+ order.order.client.lastname}
              </Typography>
              :null
            }
            {order.order.clientAddress.sector ? (
              <Typography align="justify" className={classes.subtitle}>
                <b>Sector:</b> {" " + order.order.clientAddress.sector}
              </Typography>
            ) : null}
            {order.order.clientAddress.principalStreet ? (
              <Typography align="justify" className={classes.subtitle}>
                <b>Dirección:</b> {getDireccion(order)}
              </Typography>
            ) : null}
            {order.order.clientAddress.cellphone ? (
              <Typography align="justify" className={classes.subtitle}>
                <b>Teléfono:</b> {" " + order.order.clientAddress.cellphone}
              </Typography>
            ) : null}
            <Divider className={classes.divisionText}/>
          </div>
        );
      })}
    </div>
  );
}

export default SinAsignar;
