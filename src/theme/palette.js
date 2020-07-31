import { colors } from "@material-ui/core";

const white = "#FFFFFF";
const black = "#000000";

export default {
  black,
  white,
  primary: {

    contrastText: "#ffffff",
    dark: "#000000",
    main: "#0a0a0a",
    light: "#dfdfdf"
   
  },
  secondary: {

    contrastText: "#000000",
    main: "#da3831",
    dark: "#9a0007",
    light: "#ff0000"
  },
  success: {

    contrastText: white,
    dark: colors.pink[900],
    main: colors.pink["A400"],
    light: colors.pink["A400"]
  },
  info: {
    contrastText: white,
    dark: "#bdb9b7",
    main: "#efebe9",
    light: "#e0e0e0"
    
  },
  warning: {

    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]

  },
  error: {

    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
   
  },
  text: {

    secondary: "#ffffff",
    primary: "#000000",
    link: colors.blue[600]
  },
  background: {
    default: "#f5f5f5",
    paper: "#fafafa"
  },
  icon: colors.yellow[600],
  divider: colors.grey[200]
};
