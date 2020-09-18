import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { gql } from "apollo-boost";
import { useLazyQuery } from "@apollo/react-hooks";

import Header from "../common/Header";
import {
  Grid,
  TextField,
  Button,
  IconButton,
  ListItem,
  List,
  Divider,
  Typography,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import MapContainerR from "./MapContainerR";

const estados = {
  "order-assigned": "ORDER ASIGNADA",
  "on-delivery": "INICIO DE ENTREGA",
  delivered: "ENTREGADO",
  "order-returned-to-reassign": "REASIGNADA",
};

const ALL_ORDERS = gql`
  query GetDeliveryOrders($deliveryQuery: DeliveryQuery, $token: String!) {
    getDeliveryOrders(deliveryQuery: $deliveryQuery, token: $token) {
      deliveryId
      id
      order {
        timeOut
        timeIn
        openDate
        transact
      }
    }
  }
`;

const JOURNAL = gql`
  query RouteHistory($transact: String!, $token: String!) {
    getRouteHistory(transact: $transact, token: $token) {
      history {
        id
        deliveryId
        latitude
        longitude
        time
        routeId
      }
      journal {
        deliveryId
        deliveryName
        date
        eventName
        description
        tripId
      }
    }
    getOrderDetail(transact: $transact, token: $token) {
      orderAssigned {
        id
        deliveryId

        order {
          items {
            quantity
            description
          }
          client {
            name
            lastname
          }
          clientAddress {
            principalStreet
            secondaryStreet
            countryCode
            directions
            city
            number
            phone
            cellphone
            sector
            directions
          }
        }
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    paddingTop: "2vh",
    //height: "100vh",
    width: "100vw",
    backgroundColor: theme.palette.primary.dark,
    [theme.breakpoints.up("md")]: {
      //height: "100vh",
    },
  },
  container: {},
  textField: {
    backgroundColor: theme.palette.primary.contrastText,
    color: theme.palette.secondary.main,
    padding: "1vh 1vw",
    width: "70%",
    borderRadius: 5,
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
      width: "50vw",
    },
  },
  button: {
    width: "80%",
    [theme.breakpoints.up("md")]: {
        height: "100%",
        fontSize: "1.4em"
      },
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.primary.main,
  },
  contentContainer: {
    margin: "3vh 8vw",
    backgroundColor: theme.palette.background.default,
  },
  titleResumen: {
    color: theme.palette.secondary.main,
    [theme.breakpoints.up("md")]: {
        height: "100%",
        fontSize: "1.4em"
      },
  },
  clienteData: {
    color: theme.palette.primary.contrastText,
  },
  resumenContainer: {
    margin: "3vh 8vw",
    paddingBottom: "2vh",
  },
  ordersContainer: {
    minHeight: "20vh",
    maxHeight: "40vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    boxShadow: "1px 1px 2px rgb(220,220,220)",
    paddingBottom: "2vh",

    [theme.breakpoints.down("sm")]: {
      maxHeight: "20vh",
      fontSize: "0.9em",
    },
  },
}));

function Reportes(props) {
  const classes = useStyles();
  const [showMap, setShowMap] = React.useState(false);
  const [initialDate, setInitialDate] = React.useState(
    moment().format("yyyy-MM-DD")
  );
  const [finalDate, setFinalDate] = React.useState(
    moment().format("yyyy-MM-DD")
  );

  const [initFormatDate, setIFD] = React.useState(Date.now());
  const [endFormatDate, setEFD] = React.useState(Date.now());
  const [ciudadFormat, setCF] = React.useState("");
  const [ciudades] = React.useState(localStorage.cities.split(","));
  const [ciudad, setCiudad] = React.useState("TODAS");
  const [allOrders, setAllOrders] = React.useState([]);
  const [filter, setFilter] = React.useState("");
  const [filteredOrders, setFilteredOrders] = React.useState([]);
  const [dataFromJournal, setDFJ] = React.useState(null);
  const [dataFromDetail, setDFD] = React.useState(null);
  const [showRoute, setShowRoute] = React.useState(false);
  const [dataToShowRoute, setDataToShowRoute] = React.useState(null);
  const [markers, setMarkers] = React.useState(null);
  const initDate = Date.now();
  const endDate = Date.now();
  const initialCity = "";
  const iniTransact = "123";

  console.log(dataFromDetail);

  const [deliveryQuery, setDeliveryQuery] = React.useState({
    StartDate: initDate,
    EndDate: endDate,
    City: initialCity,
  });

  const [transact, setTransact] = React.useState(iniTransact);

  const [getDeliveryOrders, order] = useLazyQuery(ALL_ORDERS, {
    variables: {
      deliveryQuery,
      token: sessionStorage.token,
    },
  });

  const [getRouteHistory, routeHistory] = useLazyQuery(JOURNAL, {
    variables: {
      transact: transact,
      token: sessionStorage.token,
    },
  });
  useEffect(() => {
    setShowMap(true);
    setShowMap(true);
  }, [dataToShowRoute]);

  useEffect(() => {
    if (deliveryQuery) {
      getDeliveryOrders();
    }
  }, [deliveryQuery]);

  useEffect(() => {
    if (transact !== "123") {
      getRouteHistory();
    }
  }, [transact]);

  useEffect(() => {
    if (routeHistory.data?.getRouteHistory) {
      setDFJ(routeHistory.data.getRouteHistory);
    } else setDFJ(null);
    if (routeHistory.data?.getOrderDetail) {
      setDFD(routeHistory.data.getOrderDetail.orderAssigned);
    }
  }, [routeHistory.data]);

  useEffect(() => {
    if (order?.data) {
      setAllOrders(order.data.getDeliveryOrders);
    }
  }, [order.data]);

  useEffect(() => {
    setFilteredOrders(allOrders);
    setFilter("");
  }, [allOrders]);

  const filterOrder = (e) => {
    e.preventDefault();
    setFilter(e.target.value);
    if (e.target.value) {
      const filterAux = e.target.value.toLowerCase();
      const filtered = allOrders.filter((el) => {
        return (
          el.deliveryId.toLowerCase().includes(filterAux) ||
          el.order.transact.toLowerCase().includes(filterAux)
        );
      });

      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(allOrders);
    }
  };

  const buscar = (e) => {
    const newQuery = {
      StartDate: initFormatDate,
      EndDate: endFormatDate,
      City: ciudadFormat,
    };
    e.preventDefault();
    setDeliveryQuery(newQuery);
  };

  const prepareData = () => {
    if (dataFromJournal?.history) {
      let points = [];
      let marks = [];
      let cont = 0;
      dataFromJournal.history.forEach((element) => {
        let point = {
          lat: element.latitude,
          lng: element.longitude,
        };
        points.push(point);
        if (cont === 0) {
          marks.push(point);
        }
        if (dataFromJournal.history.length === cont - 1) {
          marks.push(point);
        }
        cont++;
      });
      setDataToShowRoute(points);
      setMarkers(marks);
    }
  };

  const getDireccion = () => {
    let dir = "";
    if (dataFromDetail.order.clientAddress.principalStreet) {
      dir = dir + dataFromDetail.order.clientAddress.principalStreet + " ";
    }
    if (dataFromDetail.order.clientAddress.number) {
      dir = dir + dataFromDetail.order.clientAddress.number + " ";
    }
    if (dataFromDetail.order.clientAddress.secondaryStreet) {
      if (dataFromDetail.order.clientAddress.number) {
        dir = dir + dataFromDetail.order.clientAddress.secondaryStreet;
      } else
        dir = dir + " y " + dataFromDetail.order.clientAddress.secondaryStreet;
    }
    return dir;
  };

  const getGraphic = () => {
    let doc = new jsPDF();
    let img = new Image();
    img.src = 'img/logo.png'
    doc.rect(0, 0, 210, 30, "F");
    doc.addImage(img, "PNG", 10, 9, 50, 12);
    doc.setTextColor("red");
    doc.setFontSize(16);
    doc.text("RESUMEN DE ORDEN", 100, 20, "center");
    doc.setTextColor("black");
    doc.setFontSize(12);
    let orden = "Número de orden: " + transact;
    doc.text(orden, 20, 40);
    const client =
      "Cliente: " +
      dataFromDetail.order.client.name +
      " " +
      dataFromDetail.order.client.lastname;
    doc.text(client, 20, 50);
    const directions = "Dirección: " + getDireccion();
    doc.text(directions, 20, 60);
    if (dataToShowRoute) {
      let url = `
                https://maps.googleapis.com/maps/api/staticmap?&size=512x512&maptype=roadmap&markers=size:tiny|color:red|`;
      dataToShowRoute.forEach((data) => {
        url = url + "|" + data.lat + "," + data.lng;
      });

      url = url + "&path=color:0x0000ff|weight:3";
      dataToShowRoute.forEach((data) => {
        url = url + "|" + data.lat + "," + data.lng;
      });
      url = url + "&key=AIzaSyDGA3CpMqhCRFj6RPuQkfkHnw9l0sGTUx4";
      let imgData = url;
      doc.addImage(imgData, "JPEG", 20, 70, 170, 180);
    }
    doc.addPage();
    doc.rect(0, 0, 210, 30, "F");
    doc.addImage(img, "PNG", 10, 9, 50, 12);
    doc.setTextColor("red");
    doc.setFontSize(16);
    doc.text("PEDIDO", 100, 20, "center");
    doc.setTextColor("black");
    doc.setFontSize(12);
    
    const items = dataFromDetail.order?.items.map((el) => {
      return [el.description, el.quantity];
    });
    doc.autoTable({
      margin: { top: 40 },
      head: [["DESCRIPCION", "CANTIDAD"]],
      body: items,
    });

    const data = dataFromJournal.journal.map((el) => {
      let auxDate = moment(el.date);
      auxDate = auxDate.toLocaleString();
      return [estados[el.eventName], el.deliveryId, auxDate, el.description];
    });
    doc.addPage();
    doc.rect(0, 0, 210, 30, "F");
    doc.addImage(img, "PNG", 10, 9, 50, 12);
    doc.setTextColor("red");
    doc.setFontSize(16);
    doc.text("RUTA RECORRIDA", 100, 20, "center");
    doc.setTextColor("black");
    doc.setFontSize(12);
    
    doc.autoTable({
      margin: { top: 40 },
      head: [["ESTADO", "DELIVERY", "FECHA Y HORA", "DESCRIPCION"]],
      body: data,
    });

    doc.save("resumen.pdf");
  };

  return (
    <div className={classes.root}>
      <Header isReport={true} history={props.history}/>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            id="initialDate"
            value={initialDate}
            label="Fecha Inicial"
            type="date"
            onChange={(e) => {
              let auxDate = new Date(e.target.value);
              auxDate = auxDate.getTime();
              setIFD(auxDate);
              setAllOrders([]);
              setDFJ(null);
              setDFD(null);
              setShowMap(false);
              setShowMap(false);
              setInitialDate(e.target.value);
            }}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
              style: {
                color: "red",
                fontWeight: 900,
                paddingLeft: "1vw",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            id="finalDate"
            value={finalDate}
            label="Fecha Final"
            type="date"
            onChange={(e) => {
              let auxDate = new Date(e.target.value);
              auxDate = auxDate.getTime();
              setAllOrders([]);
              setDFJ(null);
              setDFD(null);
              setEFD(auxDate);
              setFinalDate(e.target.value);
              setShowMap(false);
              setShowMap(false);
            }}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
              style: {
                color: "red",
                fontWeight: 900,
                paddingLeft: "1vw",
              },
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          {localStorage.cities ? (
            <TextField
              id="ciudad"
              select
              label="Ciudad"
              value={ciudad}
              className={classes.textField}
              onChange={(e) => {
                let auxC;
                if (e.target.value === "TODAS") {
                  auxC = "";
                } else {
                  auxC = e.target.value;
                }
                setCF(auxC);
                setAllOrders([]);
                setDFJ(null);
                setDFD(null);
                setCiudad(e.target.value);
                setShowMap(false);
                setShowMap(false);
              }}
              InputLabelProps={{
                shrink: true,
                style: {
                  color: "red",
                  fontWeight: 900,
                  paddingLeft: "1vw",
                },
              }}
              SelectProps={{
                native: true,
              }}
            >
              <option key={"TODAS"} value={"TODAS"}>
                {"TODAS"}
              </option>
              {ciudades.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </TextField>
          ) : null}
        </Grid>

        <Grid item xs={12} md={3}>
          <Button
            className={classes.button}
            variant="contained"
            onClick={(e) => {
              buscar(e);
            }}
          >
            BUSCAR
          </Button>
        </Grid>
      </Grid>
      {allOrders.length > 0 ? (
        <div className={classes.contentContainer}>
          <TextField
            id="filter"
            placeholder="Seleccione una orden"
            value={filter}
            onChange={(e) => {
              filterOrder(e);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className={classes.ordersContainer}>
            <List>
              {filteredOrders.map((orden, index) => {
                return (
                  <React.Fragment key={index}>
                    <Divider />
                    <ListItem
                      alignItems="flex-start"
                      onClick={() => {
                        setShowMap(false);
                        setShowMap(false);
                        setTransact(orden.order.transact);
                      }}
                    >
                      <Typography className={classes.listItem}>
                        {orden.deliveryId + " - " + orden.order.transact}
                      </Typography>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </div>
        </div>
      ) : null}
      {dataFromJournal ? (
        <div className={classes.resumenContainer}>
          <div>
            {dataFromJournal.journal[0] ? (
              <Typography className={classes.titleResumen} align="center">
                {dataFromJournal.journal[0].tripId}
              </Typography>
            ) : null}
            {dataFromDetail.order?.client.name ? (
              <Typography className={classes.clienteData} align="justify">
                {"Cliente: " +
                  dataFromDetail.order.client.name +
                  " " +
                  dataFromDetail.order.client.lastname}
              </Typography>
            ) : null}
            {dataFromDetail.order?.clientAddress.principalStreet ? (
              <Typography className={classes.clienteData} align="justify">
                {"Dirección: " + getDireccion()}
              </Typography>
            ) : null}
            {dataFromDetail.order?.items ? (
              <div>
                <Typography> DETALLES DE LA ORDEN</Typography>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <b>DESCRIPCION</b>
                      </Grid>
                      <Grid item xs={6}>
                        <b>CANTIDAD</b>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {dataFromDetail.order.items.map((el, index) => {
                    // let auxDate = moment(el.date);
                    // auxDate = auxDate.toLocaleString();
                    return (
                      <React.Fragment key={index}>
                        <Divider />
                        <ListItem>
                          <Grid container>
                            <Grid item xs={6}>
                              {el.description}
                            </Grid>
                            <Grid item xs={6}>
                              {el.quantity}
                            </Grid>
                          </Grid>
                        </ListItem>
                      </React.Fragment>
                    );
                  })}
                </List>
              </div>
            ) : null}
          </div>
          <Typography> DETALLES DE LA ENTREGA</Typography>
          <List>
            <ListItem>
              <Grid container>
                <Grid item xs={6} md={3}>
                  <b>ESTADO</b>
                </Grid>
                <Grid item xs={6} md={3}>
                  <b>DELIVERY</b>
                </Grid>
                <Grid item xs={6} md={3}>
                  <b>FECHA Y HORA</b>
                </Grid>
                <Grid item xs={6} md={3}>
                  <b>DESCRIPCION</b>
                </Grid>
              </Grid>
            </ListItem>
            {dataFromJournal.journal.map((el, index) => {
              let auxDate = moment(el.date);
              auxDate = auxDate.toLocaleString();
              return (
                <React.Fragment key={index}>
                  <Divider />
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6} md={3}>
                        {estados[el.eventName]}
                      </Grid>
                      <Grid item xs={6} md={3}>
                        {el.deliveryId}
                      </Grid>
                      <Grid item xs={6} md={3}>
                        {auxDate}
                      </Grid>
                      <Grid item xs={6} md={3}>
                        {el.description}
                      </Grid>
                    </Grid>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Button
                className={classes.button}
                variant="contained"
                onClick={() => {
                  prepareData();
                }}
              >
                DIBUJAR RUTA
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                className={classes.button}
                variant="contained"
                disabled={!dataToShowRoute}
                onClick={() => {
                  getGraphic();
                }}
              >
                DESCARGAR RESUMEN
              </Button>
            </Grid>
          </Grid>
        </div>
      ) : null}
      {showMap && dataToShowRoute ? (
        <MapContainerR
          dataToShowRoute={dataToShowRoute}
          markersToShow={markers}
          showRoute={showRoute}
        />
      ) : null}
    </div>
  );
}

export default Reportes;
