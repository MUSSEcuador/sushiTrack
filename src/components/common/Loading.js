import React, {useEffect} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Typography, CircularProgress } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
      height: "60vh",
      width: "70vw",
      marginTop: "10vh",
      marginLeft: "10vw",
      color: theme.palette.secondary.main,
      backgroundColor: theme.palette.primary.dark,
      padding: "10vh 5vw",
      textAlign: "center"
    },
    logo: {
        margin: "1vh 3vw",
        width: "15vw",
        [theme.breakpoints.down("sm")]: {
            width: "40vw",
          },
      },
      title:{
          padding: "6vh",
          color: theme.palette.secondary.dark,
          fontWeight: 900,
          fontSize: "2.5em",
          [theme.breakpoints.down("sm")]: {
            fontWeight: 400,
            fontSize: "1.5em",
          },
      },
      subtitle:{
        padding: "4vh",
        color: theme.palette.primary.contrastText,
        fontWeight: 100,
        fontSize: "1em"
    }
}));

function Loading(props) {
    const classes = useStyles()

    const [textToShow, setTextToShow] = React.useState("Bienvenido");

    useEffect(() => {
        if (props.text)
        {
            setTextToShow(props.text)
        }
    }, [])


    return (
        <div className={classes.root}>
             <img alt="logo" src="/img/logo.png" className={classes.logo}></img>
             <Typography className={classes.title}>
                 {textToShow}
             </Typography>
             <CircularProgress color="secondary"/>
             <Typography className={classes.subtitle}>
                 Espera un momento, estamos cargando los datos necesarios
             </Typography>

        </div>
    )
}

export default Loading
