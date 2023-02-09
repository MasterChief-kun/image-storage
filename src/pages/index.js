import Image from "next/image";
import { Box, Button, ImageList, ImageListItem, Menu, MenuItem, Modal } from "@mui/material"
import SignIn from "components/SignIn"
import { signOut, useSession } from "next-auth/react"
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
import { motion } from "framer-motion"
import { useLongPress } from 'use-long-press';
import dynamic from "next/dynamic";

const Home = () => {
  const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false })
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const bind = useLongPress((event) => {
    event.preventDefault();
    handleClick(event);
  })

  const [modalOpen, setModalOpen] = React.useState(false)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

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
  let cols = 2
  let height = 500
  if(typeof window !== "undefined") {
   cols = Math.round(window.innerWidth / 500)
    height = Math.round((Math.floor(window.innerWidth / cols)))
  }
  // console.log(images)
  return (
    <Box className={styles.container}>
      {status !== "authenticated" ?
        <SignIn/>
       :
       <>
         {/* <Button onClick={() => {signOut()}}> */}
         {/*   Signout */}
         {/* </Button> */}
       <ImageList gap={8} cols={cols} rowHeight="10rem">
       {images.map((image) => (
         <>
         <ImageListItem
           key={image._id}
           margin={10}
         >
           <ImageItem image={image}/>
         </ImageListItem>
         </>
       ))}
       </ImageList>
       </>
      }
    </Box>
  )
}

const ImageItem = (props) => {
  let image = props.image
  let cols = 2
  let height = 500
  if(typeof window !== "undefined") {
   cols = Math.round(window.innerWidth / 500)
    height = Math.round((Math.floor(window.innerWidth / cols)))
  }

  const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false })
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [modalOpen, setModalOpen] = React.useState(false)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)

  const downloadImage = (url, name) => {
    fetch(url).then(res => {
      res.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a')
        a.href = url;
        a.download = name;
        a.click()
      })
    })
  }
  return (
    <motion.div
           key={image._id}
           whileHover={{
             scale: 1.0125,
           }}
           whileTap={{
             scale: 1.025
           }}
           onContextMenu={(event) => {
             event.preventDefault();
             handleClick(event);
           }}
           aria-controls={open ? 'basic-menu' : undefined}
           aria-haspopup="true"
           aria-expanded={open ? 'true' : undefined}
         >
            <Image
             src={image.path.split("public")[1]}
             height={height}
             width={500}
           />
           <Menu
             id="image-menu"
             anchorEl={anchorEl}
             open={open}
             color="palette.primary.main"
             onClose={handleClose}
             MenuListProps={{
               'aria-labelledby': 'basic-button'
             }}
             key={image._id}
           >
             <MenuItem onClick={() => {downloadImage(`${window.location.href}${(image.path.split("public")[1]).slice(1)}`, image.name)}}>Download</MenuItem>
             <MenuItem onClick={handleModalOpen}>Info</MenuItem>
             <Modal
               open={modalOpen}
               onClose={handleModalClose}
               style={{display:'flex',alignItems:'center',justifyContent:'center'}}
                key={image._id}
             >
                <Box overflow="scroll" sx= {{ height: 750, width: 500 }}>
                  <DynamicReactJson key={image._id} collapsed={true} src={image.metadata} theme="monokai"/>
                </Box>
             </Modal>
    <MenuItem onClick={() => { navigator.clipboard.writeText(`${window.location.href}${(image.path.split("public")[1]).slice(1)}`) }}>Share</MenuItem>
           </Menu>

         </motion.div>
  )
}
export default Home
