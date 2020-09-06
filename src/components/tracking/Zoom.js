import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({

  imagenVertical:{
    height: "100%"
  },
  imagenHorizontal: {
    width: "100%"
  },
  imagenContainerV: {
      maxHeight: "60vh",
      height: "60vh"
  },
  imagenContainerH: {
    maxWidth: "60vw",
    width: "60vw"
},
}));

function Zoom(props) {
  const classes = useStyles();
  const { imagenToZoom, closeZoom, proporcion } = props;

  // const [imagen, setImagen] = React.useState(
  //   `data:image/png;base64,${imagenToZoom}`
  // );


  return (

        <div className={proporcion>0?classes.imagenContainerH:classes.imagenContainerV}>
      {imagenToZoom ? (
        <img
          onClick={() => {
            closeZoom();
          }}
          className={proporcion>0?classes.imagenHorizontal: classes.imagenVertical}
          src={`data:image/jpeg;base64,${imagenToZoom}`}
          alt="noSeEncuentraImagen"
        />
      ) : null}
      </div>

  );
}

export default Zoom;
