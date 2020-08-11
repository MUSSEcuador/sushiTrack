import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Select, MenuItem, Typography, Button, TextField, IconButton, List, ListItem, Divider } from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";



const motorizadosAux = [
  {
    name: "Pepito",
  },
  {
    name: "Juanito",
  },
  {
    name: "Pablo",
  },
  {
    name: "Alex",
  },
  {
    name: "Vale",
  },
  {
    name: "Ram",
  },
  {
    name: "Peluche",
  },
  {
    name: "Antonio",
  },
  {
    name: "Gabriel",
  },
  {
    name: "José",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    height: "60vh",
    width: "50vw",
    backgroundColor: theme.palette.primary.light,
    boxShadow: "3px 3px 25px rgb(0,0,0)",
    position: "relative",
  },
  titleContainer: {
    backgroundColor: theme.palette.primary.main,
    height: "12%",
    paddingTop: "3vh",
  },
  contentContainer: {
    padding: "3vh 8vw",
  },
  title: {
    marginBottom: "3vh",
    color: theme.palette.secondary.light,
    fontWeight: 300,
    fontSize: "2em",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.3em",
    },
  },
  motorizadosContainer:{
    maxHeight: "30vh",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
    boxShadow: "1px 1px 2px rgb(220,220,220)",
  },
  button: {
    position: "absolute",
    bottom: "10%",
    left: "30%",
    width: "40%",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    fontWeight: 900,
    fontSize: "1.4em",
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

function CallMotorizado(props) {
  const classes = useStyles();

  const { motorizados } = props;
  const [filteredMoto, setFilteredMoto] = React.useState(motorizados);
  const [filter, setFilter] = React.useState("");

  const filterMotorizados = (e) => {
    console.log(e.target.value);
    setFilter(e.target.value);
    if (e.target.value) {
      const filterAux = e.target.value.toLowerCase();

      const filtered = motorizados.filter((el) => {
        return (
          el.name.toLowerCase().includes(filterAux)||
          el.firstName.toLowerCase().includes(filterAux) ||
          el.lastName.toLowerCase().includes(filterAux)
        );
      });

      setFilteredMoto(filtered);
    } else {
      setFilteredMoto(motorizados);
    }
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
          placeholder="Filtrar"
          className={classes.textField}
          value={filter}
          onChange={(e) => {
            console.log(e.target.value)
            filterMotorizados(e);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" > 
                <IconButton>
                  <SearchIcon color="primary"/>
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
                  className={classes.listItem}
                  onClick={() => {
                    console.log(persona);
                  }}
                >
                  <Typography>{persona.name + " - " + persona.firstName + " " + persona.lastName}</Typography>
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
          </div>
        <Button className={classes.button}>LLAMAR</Button>
      </div>
    </div>
  );
}

export default CallMotorizado;
