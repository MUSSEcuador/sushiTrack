import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, ButtonGroup } from "@material-ui/core";

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
    marginRight: "10vw",
  },
  button: {
    color: theme.palette.primary.contrastText,
    marginLeft: "0.2vw",
  },
  buttonSelect: {
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.primary.contrastText,
    fontSize: "1.1em",
    marginLeft: "0.2vw",
  },
  logoContainer: {
    textAlign: "left",
  },
  logo: {
    margin: "1vh 3vw",
    width: "15vw",
  },
}));
function Header(props) {
  const classes = useStyles();

  const { cityFilter, history, cities, setCityFilter } = props;

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={6} className={classes.logoContainer}>
          <img alt="logo" src="/img/logo.png" className={classes.logo}></img>
        </Grid>
        <Grid item xs={6} className={classes.buttonsContainer}>
          <ButtonGroup
            variant="contained"
            color="secondary"
            aria-label="text primary button group"
            className={classes.buttonGroup}
          >
            <Button className={cityFilter==="TODAS"?classes.buttonSelect:classes.button} onClick={() => {
                    localStorage.setItem('citySelected',"TODAS");
                    setCityFilter("TODAS");
                  }}>
              TODAS
            </Button>
            {cities.map((el, index) => {
              return (
                <Button
                  className={cityFilter===el?classes.buttonSelect:classes.button}
                  key={index}
                  onClick={() => {
                    localStorage.setItem('citySelected',el);
                    setCityFilter(el);
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
              className={classes.button}
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
    </div>
  );
}

export default Header;
