import Image from "next/image";
import { Box, Button, ImageList, ImageListItem, Menu, MenuItem, Modal, Snackbar } from "@mui/material"
import SignIn from "components/SignIn"
import { signOut, useSession } from "next-auth/react"
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import ImageView from "components/ImageView";

const Home = () => {
  let { data: session, status } = useSession()
  let [images, setImages] = React.useState([]);
  useEffect(() => {
    const getImages = async () => {
      let imagesReq = await fetch("/api/image/getImage")
      let newImages = await imagesReq.json()
      setImages(newImages)
    }
    getImages();
  }, [])

  return (
    <Box className={styles.container}>
      {status !== "authenticated" ?
        <SignIn/>
       :
       <>
         <ImageView images={images}/>
       </>
      }
    </Box>
  )
}


export default Home
