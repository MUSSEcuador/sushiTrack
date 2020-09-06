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
const getDeliveryOrders = [
  {
    id: "5f4b2ac4f57a95febd30fa50",
    deliveryId: "cborbor",
    order: {
      transact: "test1-9097198",
      externalId: 9097198,
      deliveryStatus: 2,
      client: {
        name: "AMELIA",
        lastname: "CASTELLANOS",
      },
      clientAddress: {
        city: "QUITO",
      },
    },
  },
  {
    id: "5f4b3009f57a95febd30fa52",
    deliveryId: "cborbor",
    order: {
      transact: "test1-9097198",
      externalId: 9097198,
      deliveryStatus: 2,
      client: {
        name: "AMELIA",
        lastname: "CASTELLANOS",
      },
      clientAddress: {
        city: "QUITO",
      },
    },
  },
  {
    id: "5f4b3010f57a95febd30fa54",
    deliveryId: "cborbor",
    order: {
      transact: "test1-9097200",
      externalId: 9097200,
      deliveryStatus: 2,
      client: {
        name: "AMELIA",
        lastname: "CASTELLANOS",
      },
      clientAddress: {
        city: "QUITO",
        sector: null,
        principalStreet: "POMASQUI",
        secondaryStreet: "",
      },
    },
  },
  {
    id: "5f4b3013f57a95febd30fa56",
    deliveryId: "cborbor",
    order: {
      transact: "test1-9097201",
      externalId: 9097201,
      deliveryStatus: 2,
      client: {
        name: "AMELIA",
        lastname: "CASTELLANOS",
      },
      clientAddress: {
        city: "GALAXY",
        sector: null,
        principalStreet: "POMASQUI",
        secondaryStreet: "",
      },
    },
  },
  {
    id: "5f4b3018f57a95febd30fa58",
    deliveryId: "ccaizaguano",
    order: {
      transact: "test1-9097202",
      externalId: 9097202,
      deliveryStatus: 0,
      client: {
        name: "AMELIA",
        lastname: "CASTELLANOS",
      },
      clientAddress: {
        city: "QUITO",
        sector: null,
        principalStreet: "POMASQUI",
        secondaryStreet: "",
      },
    },
  },
  {
    id: "5f4b3018f57a95febd30fa5a",
    deliveryId: "ccaizaguano",
    order: {
      transact: "test1-9097203",
      externalId: 9097203,
      deliveryStatus: 0,
      client: {
        name: "AMELIA",
        lastname: "CASTELLANOS",
      },
      clientAddress: {
        city: "Quito",
        sector: null,
        principalStreet: "POMASQUI",
        secondaryStreet: "",
      },
    },
  },
  {
    id: "5f4b3019f57a95febd30fa5c",
    deliveryId: "ccaizaguano",
    order: {
      transact: "test1-9097204",
      externalId: 9097204,
      deliveryStatus: 0,
      clientAddress: {
        city: "Quito",
        sector: null,
        principalStreet: "POMASQUI",
        secondaryStreet: "",
      },
    },
  },
];

function SinAsignar() {
  const classes = useStyles();

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
        <Typography>ORDENES NO ATENDIDAS</Typography>
      {getDeliveryOrders.map((order) => {
          console.log(order)
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
