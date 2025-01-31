// redirect-pro/src/App.js
/*global chrome*/
import './App.css';
import { ButtonGroup, Input, Button,Box } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function App() {
  const [shortcuts, setshortcuts] = useState([]);
  const [newUrl, setnewUrl] = useState('');
  const [newShortcut, setnewShortcut] = useState('');
  const [open, setOpen] = useState(false);
const [message,setMessage]=useState(''); 
const [severity,setSeverity]=useState('');
const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
const [openModal, setOpenModal] = useState(false);

const handleClickOpen = () => {
  setOpenModal(true);
};
const handleCloseModal = () => {
  setOpenModal(false);
};
  // useEffect(() => {
  //   chrome.storage.sync.get("shortcuts", (data) => {
  //     setshortcuts(data?.shortcuts || []);
  //   });
  // }, []);

  const handlenewShortcut = (event) => {
    setnewShortcut(event.target.value);
  };

  const handleClose = () =>
  {
    setOpen(false);
    setMessage('');
    setSeverity('');
  }
  const handlenewUrl = (event) => {
    setnewUrl(event.target.value); 
  };

  const handleCreate = () => { 
    
    if(newShortcut.length<=0){
      setSeverity('error')
      setOpen(true);
      setMessage("Empty shortcut cannot be created.")
      

    }

    else if(newUrl.length<=0 || !urlRegex.test(newUrl))
    {
      setSeverity('error');
      setOpen(true);
      setMessage("Url entered is not of valid format");
      
    }

    else if (newShortcut && newUrl) {
      const updatedShortcuts = [...shortcuts, { shortcut: newShortcut, url: newUrl }];
      setshortcuts(updatedShortcuts);
      setnewShortcut('');
      setnewUrl('');
      saveShortcut(updatedShortcuts);
      setOpen(true);
      setMessage('Shortcut added successfully');
      setSeverity('success');
    }
   
  };

  const saveShortcut = async (updatedShortcuts) => {
    await chrome.storage.sync.set({ shortcuts: updatedShortcuts }, () => {
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'Defaults', headerName: 'Defaults', width: 130 }, // Match the case exactly!
    { field: 'details', headerName: 'Details', width: 210,renderCell: (params) => (
      <div style={{ whiteSpace: 'normal' }}>
        {params.value}
      </div>
    ), },
  ];
  
  const rows = [
    { id: 1, Defaults: 'g text', details: 'For google search press g text eg g cars' }, // Match the case exactly!
    { id: 2, Defaults: 'yt text', details: 'For searching youtube video press yt videoname eg g LinkinPark' }, // Match the case exactly!
    { id: 3, Defaults: 'gh text', details: 'For github profile search press gh profilename eg g Omkar' }, // Match the case exactly!
    { id: 4, Defaults: 'wk text', details: 'For wikipedia seach press wk text eg wk viratKholi' }, // Match the case exactly!
    { id: 5, Defaults: 'geek', details: 'For accessing geekforgeeks website press geek' }, // Match the case exactly!
    { id: 6, Defaults: 'amazon text', details: 'For shopping your product on amazon press amazon text eg amazon racecars' }, // Match the case exactly!
  ];

  const paginationModel = { page: 0, pageSize: 5 };


  return (
    <div className="App">
      	<div class="container">
    
        <form>
        <div class="title-container">  <img src="image.png" alt="Redirect Pro Logo" class="title-image"></img>
  <h1 class="title">Redirect Pro</h1>
</div>
        <p class="subtitle">Let make web navigation easy</p>
         <input
          autoFocus
          placeholder="newShortcut"
          value={newShortcut}
          onChange={handlenewShortcut}
        />
        <input
          placeholder='newUrl'
          type="url" 
          value={newUrl}
          onChange={handlenewUrl}
        
        />
        <ButtonGroup variant="text" aria-label="Basic button group">
          <Button onClick={handleCreate}><CreateIcon></CreateIcon>Create</Button>
          <Button onClick={handleClickOpen}><EditNoteIcon></EditNoteIcon>Default Shortcuts</Button>
         
        </ButtonGroup>
        
      
      </form>
      <div class="drops">
    <div class="drop drop-1"></div>
    <div class="drop drop-2"></div>
    <div class="drop drop-3"></div>
    <div class="drop drop-4"></div>
    <div class="drop drop-5"></div>
  </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical:'top', horizontal:'center'}}>
        <Alert onClose={handleClose} severity={severity}  sx={{ width: '100%' }}>
          {message}
        </Alert>
        </Snackbar>
        <BootstrapDialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Default Shortcuts
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModal}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
          <Box sx={{  width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowHeight={() => 'auto'}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        getRowId={(row) => row.id} autoHeight
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
          </Typography>
          
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseModal}>
            Happy Routing
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>

      
      
  
  );
}

export default App;