import Grid from "@mui/material/Grid";
import nextImage from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from  "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Check, Edit } from "@mui/icons-material"
import CopyToClipboard from "react-copy-to-clipboard";
import { getImageData } from "../api/image/getImage";
// import { ObjectId } from "
const ImageDisplay = (props) => {
  const router = useRouter()
  const { imageId } = router.query;
  /* const [ image, setImage ] = useState(props.image) */
  // let imageRatio, maxHeight;
  const [copied, setCopied] = useState(false)
  let image = JSON.parse(props.image)
  // useEffect(() => {
  //   const getImage = async () => {
  //     let imageReq = await fetch("/api/image/getImage", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         imageId: imageId
  //       })
  //     })
  //     // console.log(imageReq)
  //     let imageData = await imageReq.json()
  //     setImage(imageData)
  //   }
  //   getImage();
  // }, [])
  // console.log(image)
  const imageRatio = image?.metadata?.ImageHeight/image?.metadata?.ImageWidth
  let maxHeight = 80 * imageRatio;
  let months = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sep.", "Nov.", "Dec."]
  const getDate = (rawValue) => {
    let outDate = `${months[rawValue.month]} ${rawValue.day}, ${rawValue.year} ${rawValue.hour}:${rawValue.minute}:${rawValue.second}`
    return outDate
  }
  // const getDateObjectId = (objectId) => {
  //   var imageObjectId = new ObjectId(imageId)
  //   var creationDate = imageObjectId.getTimestamp()
  //   var uploadDate = `${months[creationDate.getMonth()]} ${creationDate.getDay()}, ${creationDate.getFullYear()} ${creationDate.getHours()}:${creationDate.getMinutes()}:${creationDate.getSeconds()}`
  //   return uploadDate
  // }
  const handleCheckShow = async() => {
    setCopied(true);
    setTimeout(() => {setCopied(false)}, 3000);
  }
  return (
    <>
      {(Object.keys(image).length !== 0) &&
       <>
      <TransformWrapper>
        <TransformComponent>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minWidth="100vw"
          >
            <img
                src={`${(image?.path?.split("public")[1])}`}
                style={{
                maxWidth: '90vw',
                maxHeight: `90vh`
                }}
            />
          </Box>
        </TransformComponent>
      </TransformWrapper>
      <Box
        minWidth="100vw"
        bgcolor="#1d1f20"
        display="flex"
        flexDirection="row"
      >
        <Grid padding={1} minWidth="50%" container item sm border="1px solid red">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Typography textAlign="left" marginY={1} variant="body2">
                Title
              </Typography>
              <Typography variant="subtitle1">
                {image.name}
              </Typography>
              <CopyToClipboard
                text={`${process.env.HOST}/images/${image._id}`}
               onCopy={() => {handleCheckShow()}}
             >
                <Button>
                  Share
                </Button>
              </CopyToClipboard>
              {copied &&
                 <Check color="success"/>
              }
              {/* <IconButton sx={{height:"8px", width:"8px", bgcolor:"#3391ff"}}> */}
              {/*   <Edit sx={{ */}
              {/*     height: "10px", */}
              {/*     width: '10px' */}
              {/*   }} */}
              {/*     color="black" */}
              {/*   /> */}
              {/* </IconButton> */}
            </Box>
          </Grid>
          <Grid padding={1} minWidth="50%" item container>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400, bgcolor:"#b9b8ba"}}>
                <TableHead>
                  <TableRow>
                    <TableCell>File Info</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{color:"#d4d2d6"}}>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>{image.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shooting Date</TableCell>
                    <TableCell>{image.metadata ? getDate(image?.metadata?.DateTimeOriginal) : ""}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>File Size</TableCell>
                    <TableCell>{image?.metadata?.FileSize}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Image Size</TableCell>
                    <TableCell>{image?.metadata?.ImageSize}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Camera</TableCell>
                    <TableCell>{image?.metadata?.Model}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lens</TableCell>
                    <TableCell>{image?.metadata?.LensSpec}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Focal Length</TableCell>
                    <TableCell>{image?.metadata?.FocalLength}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ISO Sensitivity</TableCell>
                    <TableCell>{image?.metadata?.ISO}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Aperture</TableCell>
                    <TableCell>f/{image?.metadata?.FNumber}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Shutter Speed</TableCell>
                    <TableCell>{image?.metadata?.ExposureTime} sec</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
      </Box>
      </>
      }
    </>
  )
}

export async function getServerSideProps(context) {
  let image = await getImageData(context.query.imageId)

  return {
    props: {
      image: JSON.stringify(image)
    }
  }
}

export default ImageDisplay;
