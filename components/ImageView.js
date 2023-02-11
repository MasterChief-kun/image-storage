import dynamic from "next/dynamic";
const { ImageList, ImageListItem, Menu, MenuItem, Snackbar, Alert, Modal, Box } = require("@mui/material");
import React from "react"
import { motion } from "framer-motion"
import CopyToClipboard from "react-copy-to-clipboard";
import Image from "next/image"
import Link from "next/link";

export default (props) => {
  let images = props.images;
  let cols = 2
  let height = 500
  if(typeof window !== "undefined") {
   cols = Math.round(window.innerWidth / 500)
    height = Math.round((Math.floor(window.innerWidth / cols)))
  }

  return (
    <ImageList style={{margin: 10}} gap={8} cols={cols} rowHeight="10rem">
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
  function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
  }

  const [openSB, setOpenSB] = React.useState(false)
  const handleSBClick = () => {
    setOpenSB(true);
  }
  const handleSBClose = (event, reason) => {
    if(reason == 'clickaway') {
      return;
    }
    setOpenSB(false);
  }

  return (
    <Link
    href={`/images/${image._id}`}
    >
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
             src={`${process.env.FILE_HOST}/${(image.path.split("public")[1]).slice(1)}`}
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
    <MenuItem onClick={() => {downloadImage(`${process.env.FILE_HOST}${(image.path.split("public")[1]).slice(1)}`, image.name); handleClose()}}>Download</MenuItem>
             <MenuItem onClick={() => {handleModalOpen(); handleClose()}}>Info</MenuItem>
    {/* <MenuItem onClick={() => { copyToClipboard(`${window.location.href}${(image.path.split("public")[1]).slice(1)}`) }}>Share</MenuItem> */}
             <CopyToClipboard
    text={`${process.env.FILE_HOST}${(image.path.split("public")[1]).slice(1)}`}
               onCopy={() => {handleSBClick(); handleClose();}}
             >
                <MenuItem>Share</MenuItem>
             </CopyToClipboard>
           </Menu>
            <Snackbar open={openSB} autoHideDuration={3000} onClose={handleSBClose}>
                    <Alert onClose={handleSBClose} severity="success" sx={{width: '100%'}}>
                    Copied to clipboard
                    </Alert>
            </Snackbar>
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
         </motion.div>
        </Link>
  )
}
