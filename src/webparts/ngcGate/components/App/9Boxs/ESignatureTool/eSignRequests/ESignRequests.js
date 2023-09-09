import React, { useContext, useEffect, useState } from 'react';
import './ESignRequests.css';
import { AppCtx, apiUrl } from '../../../App';
import { Button, Col, Dropdown, Form, Input, Menu, Popconfirm, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import VerifySignatureModal from './Actions/VerifySignatureModal';
import ResendInvitation from './Actions/ResendInvitation';
import ShareWith from './Actions/ShareWith';
import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, DeleteOutlined, FileTextOutlined, MoreOutlined, PlusOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import DropdownSelectUser from '../../../Global/DropdownSelectUser/DropdownSelectUser';
import axios from 'axios';
import moment from 'moment';
import { GoCheck } from 'react-icons/go';
import { VscChromeClose } from 'react-icons/vsc';


function encodeBase64(key, documentId) {
  const encoded = `key=${key}&documentId=${documentId}`.toString('base64');
  return window.btoa(unescape(encodeURIComponent(encoded)));
}



const ESignRequests = () => {
  const { user_data, eSign_requests, setESignRequests } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);


  const fetchData = async (values) => {
    setLoading(true);
    const query = Object.keys(values || {}).map(key => `${key}=${values[key] || ''}`).join('&');
    const response = await axios.get(`${apiUrl}/signaturev2/MyRequests?Email=${user_data?.Data?.Mail}${(query && query.length > 0) ? '&' + query : ''}`)
    setESignRequests(response.data.Data);
    setLoading(false);
  }
  useEffect(() => {
    if(Object.keys(user_data).length > 0) {
      fetchData();
    }
  }, [user_data])

  const confirmWithdrawOrEnable = async (Id, IsActive) => {
    await axios.post(`${apiUrl}/signaturev2/Withdraw`, {DocumentId: Id, Status: IsActive ? false : true})
      .then((res) => {
        message.success(`Success, Document Is ${IsActive ? 'Withdraw' : 'Enable'} Now!`, 3);
      }).then(() => {
        const setESignRequestsUpdated = eSign_requests.map(row => {
          if(row.Id === Id) {
            row.IsActive = !row.IsActive;
          }
          return row
        })
        setESignRequests(setESignRequestsUpdated)
      }).catch(() => message.error('Failed', 3))
  }
  const confirmDelete = async (Id) => {
    await axios.get(`${apiUrl}/signaturev2/Delete?DocumentId=${Id}`)
      .then((res) => {
        message.success(res.data.Message, 3)
      }).then(() => {
        const setESignRequestsUpdated = eSign_requests.filter(row => row.Id !== Id)
        setESignRequests(setESignRequestsUpdated)
      }).catch(() => message.error('Failed', 3))
  }
  const menu = (Id, IsActive, Status, Key) => {
    const Items = [
      { key: '0', label: (<a href={`https://salicapi.com/eSign/Sign.html?key=${Key}`} target="_blank"><FileTextOutlined /> Show Document</a>), },
      {
        key: '1',
        label: (
          <Popconfirm title="Are you sure ?" disabled={Status === 'Rejected'} onConfirm={() => confirmWithdrawOrEnable(Id, IsActive)} okText={IsActive ? 'Withdraw' : 'Enable'} cancelText="Cancel">
            {IsActive ? <><StopOutlined /> Withdraw</> : <><CheckOutlined /> Enable</>}
          </Popconfirm>
        ),
        disabled: Status === 'Rejected'
      },
      { key: '2', label: <ResendInvitation Id={Id} />,
      },
      Status === 'Draft' ? { key: '3', label: <ShareWith Id={Id} /> } : null,
      {
        key: '4',
        label: (
          <Popconfirm
            title="Are you sure ?"
            onConfirm={() => confirmDelete(Id)}
            okText='Delete'
            cancelText="Cancel"
          >
            <a style={{color: '#ff272b !important'}}><DeleteOutlined /> Delete</a>
          </Popconfirm>
        ),
        danger: true
      }
    ]
    return <Menu items={Items} />
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'Number',
      width: '5%',
      render: (_, row) => eSign_requests?.indexOf(row) + 1
    },{
      title: 'Subject',
      dataIndex: 'EmailSubject',
      width: '30%',
      render: (text, row) => {
        return (
          <div className='eSign-subject'>
            <Typography.Link href={`https://salicapi.com/eSign/Sign.html?key=${row.Key}`} target='_blank' style={{display: 'inline'}}>
              {!row.IsActive ? <StopOutlined style={{color: 'var(--brand-red-color)'}} /> : null} {text}
            </Typography.Link>
            <span className='eSign-more-btn'>
              <Dropdown overlay={menu(row.Id, row.IsActive, row.Status, row.Key)} trigger={['click']}>
                <Typography.Link strong style={{marginLeft: '15px'}}><MoreOutlined /></Typography.Link>
              </Dropdown>
            </span>
          </div>
        )
      },
    },{
      title: 'Request Date',
      dataIndex: 'Created',
      key: 'Created',
      width: '8%',
      render: v => <div style={{minWidth: 170}}>{moment(v).format('MM/DD/YYYY h:mm A')}</div>
    },{
      title: 'Recipients',
      dataIndex: 'NumOfRecipients',
      key: 'NumOfRecipients',
      width: '8%',
      render: v => <div style={{textAlign: 'center'}}>{v}</div>
    },{
      title: 'Is Parallel',
      dataIndex: 'IsParallel',
      key: 'IsParallel',
      width: '8%',
      render: val => <div style={{minWidth: 90}}>{val ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> Yes</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> No</span>}</div>
    },{
      title: 'Allow Print',
      dataIndex: 'AllowPrint',
      width: '8%',
      render: val => <div style={{minWidth: 110}}>{val ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
    },{
      title: 'Allow Copy',
      dataIndex: 'AllowCopy',
      width: '8%',
      render: val => <div style={{minWidth: 110}}>{val ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
    },{
      title: 'Pending With',
      dataIndex: 'PendingWith',
      key: 'PendingWith',
      width: '20%',
      render: (val) => {
        if(val && (val?.startsWith('[') || val?.startsWith('{'))) {
          return (
            <ul>
              {
                Array.isArray(JSON?.parse(val || '[]')) ? (
                  JSON?.parse(val || '[]')?.map(u => <li>{u?.Email}</li>)
                ) : (
                  <li>{JSON?.parse(val || '{}')?.Email}</li>
                )
              }
            </ul>
          )
        }
        return ''
      }
    },{
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
      width: '14%',
      render: (val, record) => {
        if(!record.IsActive) {
          return <div style={{minWidth: 100}}><Tag icon={<StopOutlined />} color="error">Cancelled</Tag></div>
        }
        switch(val) {
          case "COMPLETED":
            return <div style={{minWidth: 100}}><Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag></div>
          case "Draft":
            return <div style={{minWidth: 100}}><Tag icon={<SyncOutlined />} color="warning">Pending</Tag></div>
          case "Rejected":
            return <div style={{minWidth: 100}}><Tag icon={<CloseCircleOutlined />} color="error">Rejected</Tag></div>
          default:
            return <div style={{minWidth: 100}}><Tag color="default">{val}</Tag></div>
        }
      }
    },{
      title: 'Signed Document',
      dataIndex: 'SignedDocument',
      width: '8%',
      render: (val, record) => (
        val
          ? <a style={{textAlign: 'center', minWidth: 120, display: 'block'}} href={`${apiUrl}/signaturev2/Download?eDocumentId=${record.Id}`} target='blank'>Download</a>
          : ''
      )
    },{
      title: 'Preview Version',
      dataIndex: '',
      width: '8%',
      render: (_, record) => (
        record.Status !== 'Rejected'
        ? (
          !record.SignedDocument 
          ? <a style={{textAlign: 'center', minWidth: 120, display: 'block'}} href={`${apiUrl}/signaturev2/DownloadCurrentVersion?eDocumentId=${record.Id}`} target='_blank'>Download</a>
          : ''
        ) : ''
      )
    }
  ];



  return (
    <div className='eSign-requests-container'>
      <div className='header'>
        <h1>eSign Requests</h1>
        <div className='controls'>
          <VerifySignatureModal />
          <Button size='small' href='https://nationalgrain.sharepoint.com/sites/portal/SitePages/eSign/NewRequest.aspx' target='_blank'><PlusOutlined /> New Request</Button>
        </div>
      </div>

      <div className='table'>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form form={form} onFinish={fetchData} layout='vertical' onReset={_ => fetchData()}>
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item name="Subject" label="Subject" style={{ marginBottom: 0 }}>
                    <Input size='large' placeholder='document subject' />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item name="Status" label="Status" style={{ marginBottom: 0 }}>
                    <Select
                      size='large'
                      placeholder="document status"
                      allowClear
                      options={[
                        { value: 'COMPLETED', label: 'Completed' },
                        { value: 'Draft', label: 'Draft' },
                        { value: 'Rejected', label: 'Rejected' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Invitee" style={{ marginBottom: 0 }}>
                    <DropdownSelectUser
                      name="Invitee"
                      required={false}
                      placeholder="invitee users"
                      allowClear={true}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Space style={{ justifyContent: 'flex-end', width: '100%' }} >
                    <Button htmlType='reset' type='ghost' disabled={loading}>Reset</Button>
                    <Button htmlType='submit' type='primary' loading={loading}>Filter</Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col span={24} style={{ overflow: 'auto hidden' }}>
            <Table
              columns={columns}
              dataSource={eSign_requests}
              loading={loading}
              pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true, style: { padding: '25px 0' }, }}
            />
          </Col>
          {/* <Col xs={24} md={0}>
            <Table 
              columns={columns?.filter(r => r.dataIndex === 'Number' || r.dataIndex === 'EmailSubject')} 
              dataSource={eSign_requests} loading={loading}
              pagination={{position: ['none', 'bottomCenter'], pageSize: 50, hideOnSinglePage: true }} 
              rowKey={record => record.Id}
              expandable={{
                expandedRowRender: (record) => (
                  <div style={{paddingLeft: '10px'}}>
                    <><b>Status: </b>{<><span style={{ fontSize: '2.5rem', lineHeight: 0, position: 'relative', top: '7px', color: record.Status === 'COMPLETED' ? 'rgb(39, 124, 98)' : 'rgb(233 155 77)'}}>•</span>{record.Status}</>}</><br/>
                    <>
                      <b>Pending With: </b>
                      {record?.PendingWith && record?.PendingWith?.startsWith('[')
                        ? (
                          <ul>
                            {
                              Array.isArray(JSON.parse(record?.PendingWith || '[]'))
                              ? (
                                JSON.parse(record?.PendingWith || '[]')?.map(u => <li>{u?.Email}</li>)
                              ) : null
                            }
                          </ul>
                        ) : null
                      }
                    </><br/>
                    <><b>Request Date: </b><div>{new Date(record.Created).toLocaleString()}</div></><br/>
                    <><b>Recipients: </b>{record.NumOfRecipients}</><br/>
                    <><b>Is Parallel: </b>
                      <div>{record.IsParallel ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
                    </><br/>
                    <><b>Has Reminder: </b>
                      <div>{record.RemindUsers ? <span><GoCheck style={{color: 'var(--brand-green-color)'}} /> True</span> : <span><VscChromeClose style={{color: 'var(--brand-red-color)'}} /> False</span>}</div>
                    </><br/>
                    <><b>Signed Document: </b>{
                      record.SignedDocument
                        ? <a href={`${apiUrl}/signaturev2/Download?eDocumentId=${record.Id}`} target='blank'>Download</a>
                        : ''
                    }</><br/>
                    <><b>Preview Version: </b>{
                      !record.SignedDocument 
                        ? <a href={`${apiUrl}/signaturev2/DownloadCurrentVersion?eDocumentId=${record.Id}`} target='blank'>Download</a>
                        : ''
                    }</><br/>
                  </div>
                ),
              }}
            />
          </Col> */}
        </Row>
      </div>
    </div>
  )
}

export default ESignRequests