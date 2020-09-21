import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import {
  Typography,
  Button,
  TextField,
  IconButton,
  List,
  ListItem,
  Divider,
  Snackbar,
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const CALL_DELIVERY = gql`
  mutation CallDeliveryToOffice(
    $callDeliveryDetail: CallDelivery
    $token: String!
  ) {
    callDeliveryToOffice(callDeliveryDetail: $callDeliveryDetail, token: $token)
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    height: "80vh",
    width: "70vw",
    backgroundColor: theme.palette.primary.light,
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    position: "relative",
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "9%",
    paddingTop: "1vh",
  },
  contentContainer: {
    padding: "3vh 8vw",
  },
  title: {
    color: theme.palette.secondary.light,
    fontWeight: 300,
    fontSize: "1.2em",
    [theme.breakpoints.down("md")]: {
      fontSize: "0.9em",
    },
  },
  motorizadosContainer: {
    minHeight: "20vh",
    maxHeight: "40vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    boxShadow: "1px 1px 2px rgb(220,220,220)",
    marginBottom: "2vh",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "20vh",
      fontSize: "0.9em"
    },

  },
  listItem: {
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em"
    },
  },
  seleccionado: {
    padding: "0 2vw",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.8em"
    },
  },
  textField: {
    margin: "2vh 2vw 0 0", 
    padding: "0 2vw",

  },
  button: {
    position: "absolute",
    bottom: "2vh",
    left: "30%",
    width: "40%",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontWeight: 900,
    fontSize: "1.4em",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
  localInfo: {
    padding: "2vh 2vw 2vh 2vw",
    boxShadow: "1px 1px 2px rgb(220,220,220)",
    backgroundColor: theme.palette.info.main,
  },
  snack: {
    boxShadow: "1px 1px 2px rgb(220,220,220)",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.light,
  },
}));

function CallMotorizado(props) {
  const classes = useStyles();
  const { local, motorizados, closeModal } = props;

  const [filteredMoto, setFilteredMoto] = React.useState(motorizados);
  const [filter, setFilter] = React.useState("");
  const [seleccionado, setSeleccionado] = React.useState(null);
  const [reason, setReason] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);
  const [callDeliveryToOffice] = useMutation(CALL_DELIVERY);

  const filterMotorizados = (e) => {
    setFilter(e.target.value);
    if (e.target.value) {
      const filterAux = e.target.value.toLowerCase();
      const filtered = motorizados.filter((el) => {
        return (
          el.name.toLowerCase().includes(filterAux) ||
          el.firstName.toLowerCase().includes(filterAux) ||
          el.lastName.toLowerCase().includes(filterAux)
        );
      });

      setFilteredMoto(filtered);
    } else {
      setFilteredMoto(motorizados);
    }
  };

  const onCall = () => {
    let auxReason
    if (reason===""){
      auxReason = "Regrese al local"
    }
    else{
      auxReason = reason
    }
    const auxCallData = {
      deliveryId: seleccionado.name,
      officeAddress: {
        principalStreet: local.address.principalStreet,
        directions: local.address.directions,
      },
      officePosition: {
        latitude: local.location.latitude,
        longitude: local.location.longitude,
      },
      reason: auxReason
    };

    callDeliveryToOffice({
      variables: {
        token: sessionStorage.token,
        callDeliveryDetail: auxCallData,
      },
    })
      .then((r) => {
        if (r.data.callDeliveryToOffice === "OK") {
          closeModal();
        } else {
          setOpenSnack(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setOpenSnack(true);
      });
  };

  const handleClose = () => {
    setOpenSnack(false);
  };
  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className={classes.title} align="center">
          Selecciona el motorizado al que deseas llamar
        </Typography>
      </div>
      <div className={classes.contentContainer}>
        <TextField
          size="small"
          fullWidth
          placeholder="Motorizado"

          value={filter}
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
        <div className={classes.motorizadosContainer}>
          <List>
            {filteredMoto.map((persona, index) => {
              return (
                <React.Fragment key={index}>
                  <Divider />
                  <ListItem
                    alignItems="flex-start"
                    
                    onClick={() => {
                      setSeleccionado(persona);
                    }}
                  >
                    <Typography className={classes.listItem}>
                      {persona.name +
                        " - " +
                        persona.firstName +
                        " " +
                        persona.lastName}
                    </Typography>
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </div>
        <div className={classes.titleContainer}>
          <Typography className={classes.title} align="center">
            RESUMEN
          </Typography>
        </div>
        <div className={classes.localInfo}>
          {seleccionado ? (
            <Typography className={classes.seleccionado}>
              <b>Llamar a :</b>
              {"  " +
                seleccionado.name +
                "  -  " +
                seleccionado.firstName +
                " " +
                seleccionado.lastName}
            </Typography>
          ) : null}

          <Typography className={classes.seleccionado}>
            <b>Al local:</b> {local.name + " - " + local.code}
          </Typography>
          <Typography className={classes.seleccionado}>
            <b>Dirección:</b>
            {local.address.principalStreet +
              " y " +
              local.address.secondaryStreet}
          </Typography>
          <TextField
          label="Ingrese el motivo de la llamada"
          placeholder="Motivo"
          fullWidth
          value={reason}
          className={classes.textField}
          onChange={(e)=>{setReason(e.target.value)}}

          InputLabelProps={{
            shrink: true,
            style: {
              fontWeight: 500,
              paddingLeft: "1vw",
            },
          }}
          />
          <Button
            className={classes.button}
            disabled={!seleccionado}
            variant="contained"
            onClick={() => {
              onCall();
            }}
          >
            LLAMAR
          </Button>
        </div>
      </div>
      <Snackbar
        open={openSnack}
        className={classes.snack}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Typography className={classes.snack}>
          NO se ha podido llamar correctamente
        </Typography>
      </Snackbar>
    </div>
  );
}

export default CallMotorizado;
