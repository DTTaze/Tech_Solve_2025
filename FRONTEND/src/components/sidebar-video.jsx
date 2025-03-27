import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
// import { useNavigate } from "react-router-dom";
import { CForm, CFormInput } from '@coreui/react'

const FormInput = () => {
  return (
    <CForm>
      <CFormInput
        type="email"
        id="exampleFormControlInput1"
        placeholder="Tìm kiếm"
        size='sm'
        className='h-5 rounded-lg'
      />
    </CForm>
  )
}

export default function VideoDrawer() {
  // const navigate = useNavigate()
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" >
      <div className='flex flex-col gap-4 p-4 m-2 justify-center items-center'>
        <button className='font-bold text-[30px]'>Green Flag</button>
        <div>
          {/* <input className='w-full border-1 border-[#7b7b7b]'/> */}
          <FormInput/>
        </div>
      </div>
      <Divider/>
      <List>
        {['Đề xuất', 'Đã follow', 'Tải lên', 'Hồ sơ'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <p>Các tài khoản đã theo dõi</p>
      <List>
        {['Tuấn Anh', 'Thiên Bảo', 'Thành Tài', 'Trung Kiên'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={true} 
              variant="persistent"
              ModalProps={{
                BackdropProps: {
                  invisible: true, 
                },
              }}
              >
              {DrawerList}
        </Drawer>
    </div>
  );
}
