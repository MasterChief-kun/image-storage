import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { signOut, useSession } from 'next-auth/react';
import { CircularProgress, Modal } from '@mui/material';
import axios from 'axios';

export default function ButtonAppBar() {
  const { data: session, status } = useSession()
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)
  const handleOpen = () => setOpen(true)
  const inputRef = React.useRef(null)
  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'inherit',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
  const [uploading, setUploading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const onChange = async (formData) => {
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        // console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        setProgress(Math.round((event.loaded * 100) / event.total))
      },
    };
    setUploading(true)
    const response = await axios.post('/api/image/uploadImage', formData, config);
    setUploading(false)
    console.log('response', response.data);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Image Storage
          </Typography>
          {(status == "authenticated" && session.user._id == process.env.ADMIN) &&
           <>
                <Button onClick={handleOpen} color="inherit">Upload</Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                    >
                      <Box
                        sx={style}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                          Upload Files
                        </Typography>
                        <input style={{display: 'none'}} ref={inputRef} type="file" onChange={onChange}/>
                        {/* <Box onClick={() => {inputRef.current.click()}} border="1px solid gray"> */}
                        <UiFileInputButton
                          label="Upload images"
                          uploadFileName="images"
                          onChange={onChange}
                          acceptedFileTypes=""
                          allowMultipleFiles={true}
                        />
                        {uploading &&
                         <CircularProgress variant="determinate" value={progress}/>
                        }
                        {/* </Box> */}
                      </Box>
                    </Modal>
            </>
          }
          <Button color="inherit" onClick={() => {signOut()}}>Signout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// export interface IProps {
//   acceptedFileTypes?: string;
//   allowMultipleFiles?: boolean;
//   label: string;
//   onChange: (formData: FormData) => void;
//   uploadFileName: string;
// }

export const UiFileInputButton = (props) => {
  const fileInputRef = React.useRef(null);
  const formRef = React.useRef(null);

  const onClickHandler = () => {
    fileInputRef.current?.click();
  };

  const onChangeHandler = (event) => {
    if (!event.target.files?.length) {
      return;
    }

    const formData = new FormData();

    Array.from(event.target.files).forEach((file) => {
      formData.append(event.target.name, file);
    });

    props.onChange(formData);

    formRef.current?.reset();
  };

  return (
    <form ref={formRef}>
      <Box border="1px solid gray" onClick={onClickHandler}>
        {props.label}
      </Box>
      <input
        accept={props.acceptedFileTypes}
        multiple={props.allowMultipleFiles}
        name={props.uploadFileName}
        onChange={onChangeHandler}
        ref={fileInputRef}
        style={{ display: 'none' }}
        type="file"
      />
    </form>
  );
};

// UiFileInputButton.defaultProps = {
//   acceptedFileTypes: '',
//   allowMultipleFiles: true,
// };
