import React, { useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Grid, TextField, IconButton, Button } from "@material-ui/core";

import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

import MapContainerF from "./MapContainerF";
import Loading from "../common/Loading";
import Error from "../common/Error";
import Header from "../common/Header";
import MotorizadoInfo from "./MotorizadoInfo";
import LocalInfo from "./LocalInfo";
import SinAsignar from "./SinAsignar";

const DATOS = gql`
  query GetSystemStats($token: String!) {
    getSystemStats(token: $token) {
      deliveries {
        hasActiveDeliveries
        name
        firstName
        lastName
        cellphone
        lastUpdate
        lastPosition {
          latitude
          longitude
        }
        city
        returningToOffice {
          reason
          officeLocation {
            principalStreet
            secondaryStreet
          }
          officePosition {
            latitude
            longitude
          }
        }
        currentRoute {
          id
          deliveryId
          order {
            origin {
              latitude
              longitude
            }
            destination {
              latitude
              longitude
            }
            client {
              name
              lastname
              identificationNumber
            }
            clientAddress {
              principalStreet
              secondaryStreet
              countryCode
              city
              phone
              cellphone
              sector
              directions
            }
            officeAddress {
              principalStreet
              secondaryStreet
              countryCode
              city
              phone
              cellphone
              sector
              directions
            }
            shippedTo
            transact
            empNum
            memCode
            deliveryStatus
            tripId
            timeOut
            timeIn
            openDate
          }
        }
        ordersAssigned {
          id
          deliveryId
          order {
            origin {
              latitude
              longitude
            }
            destination {
              latitude
              longitude
            }
            client {
              name
              lastname
              identificationNumber
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
            officeAddress {
              principalStreet
              secondaryStreet
              countryCode
              directions
              city
              phone
              cellphone
              sector
              directions
            }
            items {
              quantity
              description
            }
            shippedTo
            transact
            empNum
            memCode
            deliveryStatus
            tripId
            timeOut
            timeIn
            openDate
          }
        }
      }
      deliveriesWithActiveRoutes {
        remainOrdersAssigned
        delivery
        lastUpdate
        lastLatitude
        lastLongitude
        destinationLatitude
        destinationLongitude
        receipment
        tripId
      }
    }
  }
`;

const STORES = gql`
  query GetStores($token: String!) {
    getStores(token: $token) {
      id
      name
      code
      lastUpdate
      location {
        latitude
        longitude
      }
      address {
        principalStreet
        secondaryStreet
        city
        directions
      }
    }
  }
`;

const ALERTS = gql`
  query GetAlerts($queryAlert: QueryAlert, $token: String!) {
    getAlerts(queryAlert: $queryAlert, token: $token) {
      id
      location {
        latitude
        longitude
      }
      address {
        city
      }
      photo
      isActive
      eventName
      solution
      closedBy
      closedDate
      eventDescription
      reportedBy
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
      height: "100vh",
    },
  },
  controlPanel: {
    marginTop: "0vh",
    width: "90%",
  },
  buttonContainer: {
    margin: "0 2vw",
    width: "90%",
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
    },
  },
  buttonSelected: {
    backgroundColor: theme.palette.secondary.dark,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  buttonNotSelected: {
    backgroundColor: theme.palette.primary.light,
    "&:hover": {
      backgroundColor: theme.palette.info.dark,
    },
  },
  textField: {
    backgroundColor: theme.palette.primary.contrastText,
    margin: "2vh 0vw 0.5vh 2vw",
    paddingTop: "1vh",
    width: "90%",
    height: "4vh",
    borderRadius: 10,
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
      width: "50vw",
    },
  },
  vehMap: {
    maxHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    margin: "0 0vw 0 1vw",
    [theme.breakpoints.down("sm")]: {
      alignItems: "center",
      width: "100vw",
    },
  },
  divMapContainer: {
    margin: theme.spacing(0, 2, 0, 2),
    position: "sticky",
    display: "inherit",
    width: "72vw",
    //inicia styles
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "lightgrey",
    height: "80vh",
    align: "center",
    //fin styles
    [theme.breakpoints.only("md")]: {
      margin: "2vh 2vw 0 2vw",
      width: "70vw",
    },
    [theme.breakpoints.down("sm")]: {
      margin: "2vh 2vw 0 2vw",
      width: "100vw",
    },
  },
  infoWindowTitle: {
    color: "black",
    fontSize: "1.2rem",
  },
  infoWindowText: {
    color: "black",
  },
  sinAsignar: {
    position: "absolute",
    right: "5px",
    top: "10vh",
    width: "20vw",
    backgroundColor: theme.palette.secondary.main,
    [theme.breakpoints.down("sm")]: {
      width: "45vw",
    },
  },
}));

const NO_ATENDIDAS = gql`
  query GetOrderWithProblems($deliveryQuery: DeliveryQuery, $token: String!) {
    getDeliveryOrders(deliveryQuery: $deliveryQuery, token: $token) {
      id
      deliveryId
      order {
        transact
        externalId
        deliveryStatus
        client {
          name
          lastname
        }
        clientAddress {
          city
        }
      }
    }
  }
`;

function Track(props) {
  //import classes
  const classes = useStyles();

  //local variables
  const [isInitializeValues, setIsInitializeValues] = React.useState(true);
  const [latitudInicial, setLatitudInicial] = React.useState(-0.176663);
  const [longitudInicial, setLongitudInicial] = React.useState(-78.4845227);
  const [latitud, setLatitud] = React.useState(latitudInicial);
  const [longitud, setLongitud] = React.useState(longitudInicial);
  const [mapZoom, setMapZoom] = React.useState(13);
  const [showingInfoWindow, setshowingInfoWindow] = React.useState(false);
  const [activeMarker, setactiveMarker] = React.useState({});
  const [showRoute, setShowRoute] = React.useState(false);
  const [dataToShowRoute, setDataToShowRoute] = React.useState([]);
  const [token] = React.useState(sessionStorage.token);
  const { loading, error, data } = useQuery(DATOS, {
    variables: { token },
    pollInterval: 3000,
  });

  const [delOrLoc, setDelOrLoc] = React.useState(true);

  const [filterM, setFilterM] = React.useState("");
  const [filterL, setFilterL] = React.useState("");
  const [cityFilter, setCityFilter] = React.useState(
    localStorage.citySelected ? localStorage.citySelected : "TODAS"
  );
  const [cities, setCities] = React.useState([]);
  const [localesByCity, setLocalesByCity] = React.useState([]);
  const [locales, setLocales] = React.useState([]);

  const [startAlert] = React.useState(
    parseFloat(Date.now() - 7 * 24 * 3600 * 1000)
  );
  // const [endAlert, setEndAlert] = React.useState(Date.now());
  const [queryAlert, setQueryAlert] = React.useState({
    startDate: startAlert,
    endDate: parseFloat(Date.now()),
    isActive: true,
    address: {
      city: cityFilter === "TODAS" ? "" : cityFilter,
    },
  });

  const [deliveryQuery, setDeliveryQuery] = React.useState({
    StartDate: startAlert,
    EndDate: parseFloat(Date.now()),
    City: cityFilter === "TODAS" ? "" : cityFilter,
    OrderState: 0,
  });
  const stores = useQuery(STORES, {
    variables: { token },
    pollInterval: 300000,
  });

  const [alerts, setAlerts] = React.useState(null);
  const [ordersWithError, setOWE] = React.useState(null);

  const alertsQuery = useQuery(ALERTS, {
    variables: {
      token,
      queryAlert,
    },
    pollInterval: 3000,
  });

  const noAtendidasQuery = useQuery(NO_ATENDIDAS, {
    variables: {
      token,
      deliveryQuery,
    },
    pollInterval: 3000,
  });



  //FUNCTIONS
  const changeCity = (newCity) => {
    setCityFilter(newCity);
    let auxQuery = {
      startDate: startAlert,
      endDate: parseFloat(Date.now()),
      isActive: true,
      address: {
        city: newCity === "TODAS" ? "" : newCity,
      },
    };
    setQueryAlert(auxQuery);
    let auxnoAtendidasQuery = {
      StartDate: startAlert,
      EndDate: parseFloat(Date.now()),
      City: newCity === "TODAS" ? "" : newCity,
      OrderState: 0,
    };
    setDeliveryQuery(auxnoAtendidasQuery)
  };

  useEffect(() => {
    const interval = setInterval(() => {
      let auxQuery = {
        startDate: startAlert,
        endDate: parseFloat(Date.now()),
        isActive: true,
        address: {
          city:
            localStorage.citySelected === "TODAS"
              ? ""
              : localStorage.citySelected,
        },
      };
      setQueryAlert(auxQuery);
      let auxnoAtendidasQuery = {
        StartDate: startAlert,
        EndDate: parseFloat(Date.now()),
        City: localStorage.citySelected === "TODAS" ? "" : localStorage.citySelected,
        OrderState: 0,
      };
      setDeliveryQuery(auxnoAtendidasQuery)
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (alertsQuery.data) {
      setAlerts(alertsQuery.data.getAlerts);
    }
  }, [alertsQuery.data]);

  useEffect(() => {
    if (noAtendidasQuery.data) {
      setOWE(noAtendidasQuery.data.getDeliveryOrders);
    }
  }, [noAtendidasQuery.data]);

  useEffect(() => {
    if (stores.data) {
      let localesTemp = stores.data.getStores.slice();
      const citiesTemp = new Set();
      for (const store of localesTemp) {
        citiesTemp.add(store.address.city);
      }
      setCities(Array.from(citiesTemp));
      localStorage.setItem("cities", Array.from(citiesTemp));

      if (cityFilter !== "TODAS") {
        localesTemp = localesTemp.filter((el) => {
          return el.address.city
            .toLowerCase()
            .includes(cityFilter.toLowerCase());
        });
        setLocalesByCity(localesTemp);
        filterLocales(filterL, localesTemp);
      } else {
        setLocalesByCity(stores.data.getStores.slice());
        filterLocales(filterL, stores.data.getStores.slice());
      }
    }
  }, [stores.data]);

  useEffect(() => {
    if (stores.data) {
      if (cityFilter !== "TODAS") {
        const localesTemp = stores.data.getStores.slice().filter((el) => {
          return el.address.city
            .toLowerCase()
            .includes(cityFilter.toLowerCase());
        });
        setLocalesByCity(localesTemp);
        filterLocales(filterL, localesTemp);
      } else {
        setLocalesByCity(stores.data.getStores.slice());
        filterLocales(filterL, stores.data.getStores.slice());
      }
    }
  }, [cityFilter]);

  const callSetActiveMarker = (marker) => {
    setactiveMarker(marker);
  };

  const recenter = (order) => {
    if (mapZoom === 16) {
      setMapZoom(15);
    } else {
      setMapZoom(16);
    }
    setShowRoute(false);
    setLatitud(order.lastPosition.latitude);
    setLongitud(order.lastPosition.longitude);
  };
  const recenterLocal = (order) => {
    if (mapZoom === 16) {
      setMapZoom(15);
    } else {
      setMapZoom(16);
    }
    setShowRoute(false);
    setLatitud(order.location.latitude);
    setLongitud(order.location.longitude);
  };
  const showOffice = (position) => {
    if (mapZoom === 16) {
      setMapZoom(15);
    } else {
      setMapZoom(16);
    }
    setShowRoute(false);
    setLatitud(position.latitude);
    setLongitud(position.longitude);
  };

  const destinoCenter = (order) => {
    if (mapZoom === 16) {
      setMapZoom(15);
    } else {
      setMapZoom(16);
    }
    setShowRoute(false);
    setLatitud(order.currentRoute.order.destination.latitude);
    setLongitud(order.currentRoute.order.destination.longitude);
  };

  const showOrderRoute = (order) => {
    const data = [
      {
        lat: order.lastPosition.latitude,
        lng: order.lastPosition.longitude,
      },
      {
        lat: order.currentRoute.order.destination.latitude,
        lng: order.currentRoute.order.destination.longitude,
      },
    ];
    setDataToShowRoute(data);
    setShowRoute(true);
  };

  const filterMotorizados = (e) => {
    if (e.target.value) {
      setFilterM(e.target.value.toLowerCase());
    } else {
      setFilterM("");
    }
  };

  const filterLocales = (text, localesAux) => {
    if (text) {
      setFilterL(text.toLowerCase());
      const auxLocales = localesAux.slice().filter((el) => {
        return (
          el.name.toLowerCase().includes(text.toLowerCase()) ||
          el.code.toLowerCase().includes(text.toLowerCase()) ||
          el.address.city.toLowerCase().includes(text.toLowerCase())
        );
      });
      setLocales(auxLocales);
    } else {
      setFilterL("");
      setLocales(localesAux);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (data) {
    if (data.getSystemStats) {
      if (isInitializeValues) {
        if (data.getSystemStats.deliveriesWithActiveRoutes.length > 0) {
          if (data.getSystemStats.deliveriesWithActiveRoutes[0].lastLatitude) {
            setLatitudInicial(
              data.getSystemStats.deliveriesWithActiveRoutes[0].lastLatitude
            );
            setLongitudInicial(
              data.getSystemStats.deliveriesWithActiveRoutes[0].lastLongitude
            );
            setLatitud(
              data.getSystemStats.deliveriesWithActiveRoutes[0].lastLatitude
            );
            setLongitud(
              data.getSystemStats.deliveriesWithActiveRoutes[0].lastLongitude
            );
          }
        }
        setIsInitializeValues(false);
      }
    }

    let transformed = data.getSystemStats
      ? data.getSystemStats.deliveries.slice()
      : [];

    if (cityFilter !== "TODAS") {
      transformed = transformed.filter((el) => {
        return el.city.toLowerCase().includes(cityFilter.toLowerCase());
      });
    }

    if (filterM) {
      transformed = transformed.filter((el) => {
        return (
          el.name.toLowerCase().includes(filterM) ||
          el.firstName.toLowerCase().includes(filterM) ||
          el.lastName.toLowerCase().includes(filterM)
        );
      });
    }

    return (
      <div className={classes.root}>
        <Header
          history={props.history}
          changeCity={changeCity}
          cityFilter={cityFilter}
          cities={cities}
          alerts={alerts && alerts.length > 0 ? alerts : []}
        />
        <Grid container>
          <Grid item xs={12} md={3} className={classes.controlPanel}>
            <Grid container className={classes.buttonContainer}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  className={
                    delOrLoc
                      ? classes.buttonSelected
                      : classes.buttonNotSelected
                  }
                  onClick={() => setDelOrLoc(true)}
                >
                  DELIVERIES
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  className={
                    !delOrLoc
                      ? classes.buttonSelected
                      : classes.buttonNotSelected
                  }
                  onClick={() => setDelOrLoc(false)}
                >
                  LOCALES
                </Button>
              </Grid>
            </Grid>

            {delOrLoc ? (
              <div>
                <div>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Motorizado"
                    className={classes.textField}
                    value={filterM}
                    onChange={(e) => {
                      filterMotorizados(e);
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
                </div>
                <div className={classes.vehMap}>
                  {transformed
                    ? transformed.map((order, index) => {
                        return (
                          <MotorizadoInfo
                            order={order}
                            key={index}
                            recenter={recenter}
                            showOffice={showOffice}
                            destinoCenter={destinoCenter}
                            showOrderRoute={showOrderRoute}
                          />
                        );
                      })
                    : null}
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Locales"
                    className={classes.textField}
                    value={filterL}
                    onChange={(e) => {
                      filterLocales(e.target.value, localesByCity);
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
                </div>
                <div className={classes.vehMap}>
                  {locales
                    ? locales.map((order, index) => {
                        return (
                          <LocalInfo
                            order={order}
                            key={index}
                            recenter={recenterLocal}
                            destinoCenter={destinoCenter}
                            showOrderRoute={showOrderRoute}
                            motorizados={data.getSystemStats.deliveries}
                          />
                        );
                      })
                    : null}
                </div>
              </div>
            )}
          </Grid>
          <Grid item sm={12} md={9}>
            <MapContainerF
              latitud={latitud}
              longitud={longitud}
              mapZoom={mapZoom}
              transformed={transformed}
              showRoute={showRoute}
              dataToShowRoute={dataToShowRoute}
              activeMarker={activeMarker}
              callSetActiveMarker={callSetActiveMarker}
              setshowingInfoWindow={setshowingInfoWindow}
              showingInfoWindow={showingInfoWindow}
            />
          </Grid>
        </Grid>
        {ordersWithError? (
          <div className={classes.sinAsignar}>
            <SinAsignar  ordersWithError={ordersWithError}/>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Track;
