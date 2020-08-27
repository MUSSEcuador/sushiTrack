import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";

import {
  Grid,
  Typography,
  TextField,
  Button,
  Snackbar,
} from "@material-ui/core";

const DATA_LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    posit: "relative",
  },
  container: {
    width: "fit-content",
  },
  left: {
    backgroundColor: theme.palette.primary.dark,
    height: "100vh",
    width: "100vw",
    [theme.breakpoints.down("sm")]: {
      height: "10vh",
      width: "100vw",
    },
  },
  logo: {
    margin: "1vh 3vw",
    width: "25vw",
    [theme.breakpoints.down("xs")]: {
      width: "45vw",
    },
  },
  bienvenida: {
    color: theme.palette.secondary.light,
    marginTop: "30vh",
    fontWeight: 500,
    fontSize: "4em",
    [theme.breakpoints.down("sm")]: {
      marginTop: "5vh",
      fontWeight: 300,
      fontSize: "1.5em",
    },
  },
  title: {
    marginTop: "10vh",
    fontSize: "1.2em",
    fontWeight: 500,
    [theme.breakpoints.down("sm")]: {
      fontSize: "1em",
    },
  },
  form: {
    marginTop: "20vh",
    marginRight: "4vw",
    [theme.breakpoints.down("sm")]: {
      marginTop: "10vh",
    },
  },
  label: {
    marginTop: "2vh",
    fontSize: "1.1em",
    fontWeight: 400,
  },
  textField: {
    margin: "0 0 5vh 0",
  },
  button: {
    position: "absolute",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontSize: "1.1em",
    fontWeight: 400,
    width: "15vw",
    right: "5vw",
    bottom: "5vh",
    [theme.breakpoints.down("sm")]: {
      right: "5vw",
      bottom: "5vh",
      fontSize: "1em",
      fontWeight: 300,
      width: "25vw",
    },
  },
  snack: {
    backgroundColor: theme.palette.primary.light,
    padding: "1vh 2vw",
  },
}));

function Login(props) {
  const classes = useStyles();
  const [userName, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [openSnack, setOpenSnack] = React.useState(false);

  //const {loading, error, data} = useMutation(DATA_LOGIN);

  const [login] = useMutation(DATA_LOGIN);



  const submit = (e) => {
    e.preventDefault();
    login({ variables: { username: userName, password: password } })
      .then(result => {
        if (result.data?.login?.token) {
          sessionStorage.setItem('token',result.data.login.token);
          props.history.push("/track");
        } else {
          setOpenSnack(true);
          setUserName("");
          setPassword("");
        }
      })
      .catch(err=>console.log(err));
    
    // props.history.push("/track");
    // sessionStorage.setItem('token','123-123-123');
  };

  const handleClose = () => {
    setOpenSnack(false);
  };

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid item xs={12} md={6} className={classes.left}>
          <img alt="logo" src="/img/logo.png" className={classes.logo}></img>
          <Typography align="center" className={classes.bienvenida}>
            Bienvenido
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography align="center" className={classes.title}>
            Ingresa tus credenciales para acceder al sistema
          </Typography>
          <form
            className={classes.form}
            onSubmit={(e) => {
              submit(e);
            }}
          >
            <Grid container>
              <Grid item xs={4}>
                <Typography className={classes.label}>Usuario</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  variant="outlined"
                  className={classes.textField}
                  value={userName}
                  fullWidth
                  required
                  autoComplete="current-password"
                  placeholder="Usuario"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography className={classes.label}>Contraseña</Typography>
              </Grid>
              <Grid item xs={8}>
                <TextField
                  variant="outlined"
                  className={classes.textField}
                  fullWidth
                  value={password}
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Button className={classes.button} variant="outlined" type="submit">
              INGRESAR
            </Button>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        open={openSnack}
        className={classes.snack}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Typography>Su usuario y/o contraseña son incorrectos</Typography>
      </Snackbar>
    </div>
  );
}

export default Login;
