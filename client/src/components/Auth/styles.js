import { makeStyles } from '@material-ui/core';
import bgImage from '../../assets/images/bg-img.png';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    justifyContent: 'center',
  },
  primaryBtn: {
    alignSelf: 'center',
    '&:hover': {
      color: '#fff',
      backgroundColor: '#86B9FF',
    },
  },
  secondaryBtn: {
    boxShadow: '0 0 10px 4px rgba(0, 0, 0, 0.05)',
    margin: theme.spacing(1),
    alignSelf: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '80%',
  },
  background: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
  },
  gradient: {
    background: 'linear-gradient(180deg, #3A8DFF, #86B9FF)',
    opacity: 0.9,
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    lineHeight: 1.5,
    fontWeight: 500,
    marginTop: theme.spacing(7),
    color: '#FFFFFF',
  },
  formContainer: {
    paddingLeft: '10vw',
    paddingTop: '10vh',
  },
}));

export default useStyles;
