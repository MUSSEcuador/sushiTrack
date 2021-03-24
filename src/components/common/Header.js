import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, ButtonGroup, Badge, Modal } from "@material-ui/core";
import Alerts from "../tracking/Alerts";

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: "4vw",
    marginTop: "1vh",
  },
  buttonsContainer: {
    textAlign: "right",
  },
  buttonGroup: {
    color: "rgb(255,255,255)",
    marginRight: "5vw",
    //width: "20vw",
    [theme.breakpoints.down("sm")]: {
      width: "99vw",
    },
  },
  button: {
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.primary.contrastText,
    marginLeft: "0.2vw",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.5em",
      marginLeft: "0x",
    },
  },
  buttonSelect: {
    color: theme.palette.primary.contrastText,

    fontSize: "1.1em",
    marginLeft: "0.2vw",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.5em",
    },
  },
  buttonAlertOn: {
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.primary.contrastText,
    marginLeft: "0.2vw",
    fontWeight: 900,
    boxShadow: "0px 0px 50px rgb(250,200,200)",
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.5em",
      marginLeft: "0x",
    },
  },
  buttonAlertOff: {
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.primary.contrastText,
    marginLeft: "0.2vw",
    fontWeight: 900,
    [theme.breakpoints.down("xs")]: {
      fontSize: "0.5em",
      marginLeft: "0x",
    },
  },
  logoContainer: {
    textAlign: "left",
  },
  logo: {
    margin: "1vh 3vw",
    width: "15vw",
  },
  badge: {
    fontSize: "4vh",
    backgroundColor: "#fff",
    color: "orange",
  },
  modal: {
    marginLeft: "15vw",
    marginTop: "10vh",
    marginRight: "25vw",
  },
}));
function Header(props) {
  const classes = useStyles();

  const {
    cityFilter,
    history,
    cities,
    changeCity,
    recenterCity,
    alerts,
    isReport,
    setAuxMarkerToShow,
    auxMarkerToShowCenter,
  } = props;

  const [allAlerts, setAlerts] = React.useState(alerts ? alerts : []);
  const [alertsNumber, setAlertsNumber] = React.useState(
    alerts ? alerts.length : 0
  );
  const [openAlert, setOpenAlert] = React.useState(false);

  const closeModal = () => {
    setOpenAlert(false);
  };
  useEffect(() => {
    if (alerts) {
      setAlerts(alerts);
      setAlertsNumber(alerts.length);
    }
  }, [alerts]);


  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6} md={3} className={classes.logoContainer}>
          <img alt="logo" src="/img/logo.png" className={classes.logo}></img>
        </Grid>
        <Grid item xs={6} md={1}>
          {allAlerts && alertsNumber > 0 ? (
            <Badge badgeContent={alertsNumber} max={999}>
              <Button
                variant="contained"
                fullWidth
                className={classes.buttonAlertOn}
                onClick={() => {
                  setOpenAlert(true);
                }}
              >
                {" "}
                ALERTAS{" "}
              </Button>
            </Badge>
          ) : null}
        </Grid>
        <Grid item xs={12} md={8} className={classes.buttonsContainer}>
          <ButtonGroup
            variant="contained"
            color="secondary"
            aria-label="text primary button group"
            className={classes.buttonGroup}
          >
            {!isReport ? (
              <Button
                className={
                  cityFilter === "TODAS" ? classes.buttonSelect : classes.button
                }
                onClick={() => {
                  localStorage.setItem("citySelected", "TODAS");
                  changeCity("TODAS");
                  recenterCity(-0.176663, -78.4845227);
                }}
              >
                TODAS
              </Button>
            ) : null}
            {cities?.map((el, index) => {

              return (
                <Button
                  className={
                    cityFilter === el ? classes.buttonSelect : classes.button
                  }
                  key={index}
                  onClick={() => {
                    localStorage.setItem("citySelected", el);
                    changeCity(el);
                    switch (el.toUpperCase()) {
                      case "QUITO":
                        recenterCity(-0.176663, -78.4845227);
                        break;
                      case "GUAYAQUIL":
                        recenterCity(-2.1595552, -79.8970075);
                        break;
                        case "CUENCA":
                        recenterCity(-2.8989551, -78.4845227);
                        break;
                        case "MANTA":
                          recenterCity(-0.9436228, -80.7338208);
                          break;
                      default:
                        recenterCity(-0.176663, -79.0042444);
                        break;
                    }
                  }}
                >
                  {el}
                </Button>
              );
            })}
          </ButtonGroup>
          <ButtonGroup
            variant="text"
            color="secondary"
            aria-label="text primary button group"
          >
            <Button
              className={classes.buttonSelect}
              onClick={() => {
                sessionStorage.removeItem("token");
                history.push("/login");
              }}
            >
              Cerrar Sesión
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Modal open={openAlert} onClose={closeModal} className={classes.modal}>
        <div>
          <Alerts
            closeModal={closeModal}
            alerts={allAlerts}
            setAuxMarkerToShow={setAuxMarkerToShow}
            auxMarkerToShowCenter={auxMarkerToShowCenter}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Header;
