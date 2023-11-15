import React from 'react'
import CircularProgress from '@mui/joy/CircularProgress'

const Loader = () => {
  return (
    <div style={{height:"100vh",width:"100%",position:"absolute",top:"0px",left:"0px",background:'rgba(0,0,0,0.8)',display:'grid',placeItems:"center",zIndex:"1000"}}>
         <CircularProgress color="neutral" thickness={2} size="lg" />

    </div>
  )
}

export default Loader