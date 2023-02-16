import Image from "next/image";
import { Box, Button, ImageList, ImageListItem, Menu, MenuItem, MenuList, Modal, Snackbar } from "@mui/material"
import SignIn from "components/SignIn"
import { signOut, useSession } from "next-auth/react"
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import ImageView from "components/ImageView";
import { getImageData } from "./api/image/getImage";

const Home = (props) => {
  let { data: session, status } = useSession()
  let [images, setImages] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // let images = JSON.parse(props.images);
  useEffect(() => {
    // const getImages = async () => {
    //   let imagesReq = await fetch("/api/image/getImage")
    //   let newImages = await imagesReq.json()
    //   setImages(newImages)
    // }
    // getImages();
    if(localStorage.getItem("sort") == "up-lt") {
      setImages((JSON.parse(props.images)).reverse())
    } else {
      setImages(JSON.parse(props.images))
    }
  }, [])

  return (
    <Box className={styles.container}>
      {status !== "authenticated" ?
        <SignIn/>
       :
       <>
         <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
         >
           Sort
         </Button>
         <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
            'aria-labelledby': 'basic-button',
            }}
         >
           <MenuItem onClick={() => {
             if(localStorage.getItem("sort") !== "up-lt") {
                setImages(images.reverse())
                localStorage.setItem("sort", "up-lt")
             } return;
           }}>
             By upload date: Latest First
           </MenuItem>
           <MenuItem onClick={() => {
             if(localStorage.getItem("sort") !== "up-od"){
               setImages(images.reverse())
               localStorage.setItem("sort", "up-od")
             } return;
           }}>By upload date: Oldest First</MenuItem>
         </Menu>
         <ImageView images={images}/>
       </>
      }
    </Box>
  )
}

export async function getServerSideProps(context) {
  let images = await getImageData()

  return {
    props: {
      images: JSON.stringify(images)
    }
  }
}
export default Home
