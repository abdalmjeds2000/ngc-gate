import React from 'react';
import { Button, message, Modal, Popover, Table } from 'antd';
import { useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined, MessageOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import AntdLoader from '../../../../Global/AntdLoader/AntdLoader';

const ResendInvitation = (props) => {
  const [openModal, setOpenModal] = useState(false)
  const [data, setData] = useState([])
  const [dataLoader, setDataLoader] = useState(true)

  let getInvitation = () => {
    setOpenModal(true)
    axios({
      method: 'GET',
      url: `https://salicapi.com/api/signaturev2/Recipients?eDocumentId=${props.Id}`
    }).then((res) => {
      let data = res?.data?.Data;
      setData(data);
      setDataLoader(false);
    }).catch(err => {
      console.log(err); 
      setDataLoader(false)
    })
  }

  let sendInvite = (val) => {
    axios({
      method: "POST",
      url: "https://salicapi.com/api/signaturev2/Invite",
      data: val
    }).then((res) => {
      res.data.Status === 200
      ? message.success("The invitation has been sent successfully!")
      : message.success("Failed to send invitation!")
    }).catch(err => {
      console.log(err)
      message.error("Something Wrong!")
    })
  }

  const columns = [
    {
      title: '#',
      width: '4%',
      render: (_, row) => data?.indexOf(row) + 1
    },{
      title: 'Recipient Name',
      dataIndex: 'InviteeName',
      width: '38%',
      render: (value, row) => !value || value === "" ? row.EmailAddress : value
    },{
      title: 'Action',
      width: '58%',
      render: (_, row) => (
        <div>
          {row?.Invitations?.length > 0 
          ? (
            <div style={{ marginBottom: 7 }}>
              {row?.Invitations?.map((item, i) => (
                <span style={{ display: 'block', lineHeight: 1.4 }} key={i}><CheckCircleOutlined />{' '}{item}</span>
              ))}
            </div>
          )
          : null}
          {
            row.Status === "Pending"
              ? (data?.filter(item => item?.Status?.toLowerCase() === "rejected")?.length > 0 ? " - " : <a onClick={() => sendInvite({DocumentId: props.Id, Email: `${row.EmailAddress||""}`, Key: row.Key})}>Invite</a>)
            : row.Status === "Rejected" 
              ? <span>
                  <span>
                    <span style={{color: "var(--brand-red-color)"}}><CloseCircleOutlined /> Rejected </span>
                    <Popover placement="topLeft" title="Rejection Reason" content={<div style={{whiteSpace:"pre-line", maxWidth: 350}}>{row.RejectReason}</div>} trigger="click">
                      <Button type="link" size="small" style={{color:"#333"}}><MessageOutlined /></Button>
                    </Popover>
                  </span>
                  <span>At {moment(row.Modified).format('MM/DD/YYYY hh:mm A')}</span>
                </span>
            : <span><span style={{color: "var(--brand-green-color)"}}><CheckCircleOutlined /> Signed</span> At {moment(row.Modified).format('MM/DD/YYYY hh:mm A')}</span>
          }
        </div>
      )
    },
  ]
  return (
    <>
      <a onClick={getInvitation}><SyncOutlined /> Invitations</a>
      <Modal
        title="Invitations"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        className='more-width-antd-modal'
        okButtonProps={{ style: {display: 'none'}}}
      >
        {
          !dataLoader
          ? <Table 
              columns={columns} 
              dataSource={data} 
              pagination={{position: ['none', 'bottomCenter'], pageSize: 10, hideOnSinglePage: true }} 
            />
          : <AntdLoader />
        }
      </Modal>
    </>
  );
}
export default ResendInvitation;