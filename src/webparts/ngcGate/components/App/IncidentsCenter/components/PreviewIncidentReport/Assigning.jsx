import { Avatar, Button, Col, Empty, Form, Image, Input, Modal, Row, Select, Steps, Switch, Tag, Timeline, Tooltip, Typography, Upload, message, notification } from 'antd';
import React, { useContext, useState } from 'react';
// import DropdownSelectUser from '../../../Global/DropdownSelectUser/DropdownSelectUser';
import { AutoCompleteOrgUsers } from "salic-react-components";
import { CheckCircleOutlined, ClockCircleOutlined, CommentOutlined, LeftOutlined, MinusCircleOutlined, PlusOutlined, SendOutlined, TableOutlined, UploadOutlined } from '@ant-design/icons';
import { AppCtx, apiUrl } from '../../../App';
import axios from 'axios';
import moment from 'moment';
import DepartmentFeedback from './DepartmentFeedback';
import FileIcon from '../../../Global/RequestsComponents/FileIcon';
import ApproveAction from "./ApproveAction";
import useIsAdmin from '../../../Hooks/useIsAdmin';

function hasDepartmentDuplicates(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i]?.ResponsibleDepartment === arr[j]?.ResponsibleDepartment) {
        return true;
      }
    }
  }
  return false;
}



const Assigning = ({ reportData, onFinish }) => {
  const { user_data, ngc_departments, sp_site } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [conversationConfig, setConversationConfig] = useState({ show: false, data: {} });
  const [isAdmin] = useIsAdmin('Incident_Admin');

  const submitData = async (values) => {
    setLoading(true);
    let data = values;
    data.Email = user_data?.Data?.Mail;
    data.Id = `${reportData?.Id}`;
    if(data?.Assignees?.length) {
      if(hasDepartmentDuplicates(data?.Assignees)) {
        setLoading(false);
        notification.error({message: "Failed:", description: "You can't assign the same department twice."})
        return;
      }
    }
    data.Assignees = data?.Assignees?.map(item => ({...item, AssignedBy: user_data?.Data?.Mail}));

    const response = await axios.post(`${apiUrl}/Incidents/Assign`, data);
    if(response?.status == 200 || response?.status == 201) {
      if(onFinish) onFinish();
      notification.success({message: response?.data?.Message || "DONE !"});
    } else {
      notification.error({message: "failed"});
    }
    setLoading(false);
  }

  const isClosed = ["CLOSED", "CLOSEDEARLY"].includes(reportData?.Status);

  const handleAfterConverstionAction = async (assigneeId) => {
    const reloadReport =  await onFinish();
    setConversationConfig({ show: true, data: reloadReport?.Assignees?.find(item => item?.Id === assigneeId) });
  }

  return (
    <div style={{ maxWidth: 1920, margin: '0 auto' }}>
      <Typography.Text style={{display: 'block', fontSize: '1.6rem', fontWeight: 500, marginBottom: 25}}>
        Risk Department {conversationConfig.show ? ` Of ${conversationConfig?.data?.ResponsibleDepartment} conversation` : ""}
      </Typography.Text>
      {
        isAdmin && ["REVIEW"].includes(reportData?.Status) ? (
          <Form
            name="risk-department-part" 
            layout="vertical"
            form={form} 
            onFinish={submitData}
            onFinishFailed={() => message.error("Please, fill out the form correctly.")}
            disabled={isClosed}
          >
            <Form.Item>
              <Form.List
                name="Assignees"
                rules={[{
                  validator: async (_, items) => {
                    if (!items || items.length < 1) {
                      return Promise.reject();
                    }},
                }]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields?.map((field, index) => (
                      <Row gutter={[15, 0]} style={{ padding: 10, borderRadius: 5, border: '1px solid #eee', marginBottom: 10 }}>
                        <Col span={24}>
                          <Form.Item name={[field.name, "RiskDepartmentComment"]} label="Risk Department Comments" rules={[{required: true, message: ""}]}>
                            <Input.TextArea size='large' rows={4} placeholder="comments from reviewers" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                          <Form.Item name={[field.name, "ResponsibleDepartment"]} label="Responsible Department" rules={[{required: true, message: ""}]}>
                            <Select
                              showSearch
                              removeIcon
                              size='large'
                              placeholder="Select a department"
                              optionFilterProp="children"
                              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase()) }
                              options={[
                                { value: 'IT', label: 'Department Of IT', },
                                ...ngc_departments.filter(item => item !== "").map(item => ({ label: item, value: item }))
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                          <Form.Item name={[field.name, "AssignTo"]} label="Assign Respondent" rules={[{required: true, message: ""}]}>
                            <AutoCompleteOrgUsers valueRender='mail' size='large' placeholder="select person name" />
                          </Form.Item>
                        </Col>
                        <Col span={24} style={{display: 'flex', justifyContent: 'flex-end'}}>
                          {fields.length > 1 ? (
                            <Button danger icon={<MinusCircleOutlined />} onClick={() => remove(field.name)}>Remove</Button>
                          ) : null}
                        </Col>
                      </Row>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      onLoad={add}
                      style={{width: '100%', marginTop: 25}}
                      size='large'
                      icon={<PlusOutlined />}
                    >
                      Add Department
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </Form.List>
            </Form.Item>
            <Row justify="end" gutter={10}>
              <Col>
                <Button type='primary' size='large' htmlType='submit' loading={loading}>Assign</Button>
              </Col>
            </Row>
          </Form>
        ) : (
          isClosed && reportData?.Assignees?.length === 0 ? (
            <Empty 
              description={
                <Typography.Text type='secondary'>
                  The report has no assignment
                </Typography.Text>
              }
            />
          ) : (
            <>
            {
              conversationConfig?.show
              ?
                <IncidentConversation isAdmin={isAdmin} reportData={reportData} conversationConfig={conversationConfig} setConversationConfig={setConversationConfig} onFinish={id => handleAfterConverstionAction(id)} />
              :
                <div style={{ position: 'relative' }}>
                  <div style={{ textAlign: 'center', marginBottom: 4 }}>
                    <Avatar size='large' src={<Image src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${reportData?.Assignees?.[0]?.ByUser?.Mail}`} />} />
                    <Typography.Text style={{display: 'block', fontSize: '1.2rem', fontWeight: 500}}>{reportData?.Assignees?.[0]?.ByUser?.DisplayName}</Typography.Text>
                  </div>
                  <Timeline mode="left" /* pending={isPendingWithDepts ? <Typography.Text type='secondary'>Departments are reviewing the incident, please wait for their response.</Typography.Text> : null} */>
                    <Timeline.Item label="" style={{ paddingBottom: 60 }}></Timeline.Item>
                    {reportData?.Assignees?.map((item, indx) => {
                      const isPendingWithDept = item.Status === "PENDING_WITH_DEPARTMENT";
                      return (
                        <Timeline.Item 
                          key={indx} 
                          label={
                            <>
                              <div style={{fontWeight: 500, fontSize: '1.1rem', lineHeight: 1}}>{item?.ResponsibleDepartment}</div>
                              <div>{item?.ToUser?.DisplayName}</div>
                              <Typography.Text type='secondary'>{moment(item?.CreatedAt).format("MM/DD/YYYY h:mm A")}</Typography.Text>
                            </>
                          } 
                          color={isPendingWithDept ? "orange" : "green"}
                          dot={isPendingWithDept ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : <CheckCircleOutlined />}
                        >
                          {/* <Typography.Paragraph
                            ellipsis={{ rows: 5, expandable: true }}
                            title={item?.RiskDepartmentComment}
                            style={{ display: "block", whiteSpace: "pre-line" }}
                          >
                            {item?.RiskDepartmentComment}
                          </Typography.Paragraph> */}
                          <div /* style={{ whiteSpace: "pre-line" }} */>{item?.RiskDepartmentComment}</div>
                          <br />
                          <DepartmentResponse isAdmin={isAdmin} reportData={reportData} formData={item} onFinish={onFinish} setConversationConfig={setConversationConfig} />
                        </Timeline.Item>
                      )
                    })}
                  </Timeline>
                </div>
            }
            </>
          )
        )
      }
    </div>
  )
}

export default Assigning



const DepartmentResponse = ({ isAdmin, reportData, formData, onFinish, setConversationConfig }) => {
  const [departmentResponseVisible, setDepartmentResponseVisible] = useState(false);


  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginTop: 7 }}>
        {isAdmin && 
          <Button size="small" icon={<TableOutlined />} onClick={() => setDepartmentResponseVisible(true)}>
            Department Response
          </Button>}
        <Button size="small" icon={<CommentOutlined />} onClick={() => setConversationConfig({ show: true, data: formData || {} })}>
          Converstion
        </Button>
        {/* {reportData.Status !== "CLOSED" && formData?.Status !== "CLOSED" ? <CloseDepartmentAction IncidentId={reportData.Id} TaskId={formData.Id} onFinish={onFinish} /> : null} */}
      </div>

      <Modal
        title="Department Response"
        open={departmentResponseVisible}
        onCancel={() => setDepartmentResponseVisible(false)}
        footer={null}
        width={800}
      >
        <DepartmentFeedback
          reportData={reportData}
          formData={formData}
          onFinish={onFinish}
          customLayout="vertical"
        />
      </Modal>
    </>
  )
}


const IncidentConversation = ({ isAdmin, reportData, conversationConfig, setConversationConfig, onFinish }) => {
  const { user_data, sp_site } = useContext(AppCtx);
  const [new_comment_form] = Form.useForm();
  const [messageType, setMessageType] = useState('Message'); // Message, Approval
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const formData = conversationConfig?.data;
  const conversations = formData?.conversations || [];
  
  const handleAddComment = async (values) => {
    let isFilesFinishUpload = true;
    const files = attachments?.map(file => {
      if(file.status === "uploading") isFilesFinishUpload = false
      return file.response?.uploadedFiles[0]?.Name
    });
    if(!isFilesFinishUpload) {
      message.error("Please wait for all files to finish uploading!");
      return;
    }
    const payload = {
      body: values.comment_body,
      incident_task_id: formData?.Id,
      fromUser: user_data.Data.Mail,
      toUser: values.approval || user_data.Data.Mail,
      type: messageType, // Message, Approval
      attachments: files.join(",")
    }
    if(values?.new_comment?.trim() === '') {
      message.error("Please enter a valid comment!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/Incidents/AddIncidentTaskDetail`, payload);
      new_comment_form.resetFields();
      setAttachments([]);
      message.success("Message sent successfully!");
      setMessageType('Message');
      if(onFinish) onFinish(formData?.Id);
    } catch (error) {
      message.error("Something went wrong, please try again later!");
      return;
    } finally {
      setLoading(false);
    }
  }

  const onClose = () => {
    setConversationConfig({ show: false, data: {} });
  }

  let actionPending;
  let actionPendingWithMe;
  if(conversations.length > 0) {
    actionPending = conversations?.filter(item => item.Type === "Approval" && item.ApprovalStatus === "PENDING")?.length > 0;
    actionPendingWithMe = conversations?.filter(item => item.Type === "Approval" && item.ApprovalStatus === "PENDING" && item?.ToUser?.Mail?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase())?.[0];
  }

  if(!conversationConfig) return <React.Fragment />;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button type='link' size='large' onClick={onClose} icon={<LeftOutlined />} style={{ padding: 0, marginBottom: 10 }}>Back</Button>
        {isAdmin && reportData?.Status !== "CLOSED" && formData?.Status !== "CLOSED" ? <CloseDepartmentAction IncidentId={reportData?.Id} TaskId={formData?.Id} onFinish={onFinish} /> : null}
      </div>
      <Steps direction="vertical">
        {
          conversations?.map((item, indx) => (
            <Steps.Step
              key={item?.Id || indx}
              style={{ paddingBottom: 15 }}
              icon={<Avatar icon={<Image src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${item?.FromUser?.Mail}`} />} />}
              title={
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, marginBottom: 5 }}>
                  <Typography.Text style={{ fontSize: '1rem' }} type='secondary'>
                    <Typography.Text strong>{item?.FromUser?.DisplayName}</Typography.Text>
                    <Typography.Text type='secondary'> {item?.ToUser ? ` to ${item?.ToUser?.DisplayName}` : null}</Typography.Text>
                  </Typography.Text>
                  <Typography.Text type='secondary' style={{ fontSize: '0.8rem' }}>{moment(item?.CreatedAt).format("MM/DD/YYYY h:mm A")}</Typography.Text>
                </div>
              }
              description={
                <>
                  <div style={{ width: 'fit-content', backgroundColor: item?.FromUser?.Mail?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase() ? '#e6edf4' : '#f6f6f6', borderRadius: 7, padding: '6px 12px' }}>
                    <span style={{ display: 'block', color: item?.FromUser?.Mail?.toLowerCase() === user_data?.Data?.Mail?.toLowerCase() ? '#0c508c' : '#333', fontSize: '1rem', whiteSpace: "pre-line" }}>
                      {item?.Body}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', margin: item?.Attachments == '' ? '' : '8px 0' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 3, }}>
                        {
                          item?.Attachments?.split(",")?.map((attachment, index) => {
                            if(!attachment || attachment === "") return null;
                            return (
                              <FileIcon
                                key={index} 
                                FileType={attachment.split(".").pop()}
                                FileName={attachment}
                                FilePath={`https://dev.salic.com/File/${attachment}`}
                                IconWidth='25px'
                              />
                            )
                          })
                        }
                      </div>
                    </div>
                  </div>
                  {
                    ["Approved", "Rejected"].includes(item?.ApprovalStatus) ?
                      <div style={{width: "fit-content", marginTop: 12, backgroundColor: item?.ApprovalStatus === "Approved" ? "#e3fff8" : item?.ApprovalStatus === "Rejected" ? "#fff4f4" : null, padding: 10, marginLeft: 30, borderRadius: "0 5px 5px 0", borderLeft: item?.ApprovalStatus === "Approved" ? "3px solid #009688" : item?.ApprovalStatus === "Rejected" ? "3px solid #E91E63" : null}}>
                        {
                          item?.ApprovalStatus === "Approved" ?
                            <>
                              <span style={{color: "teal", fontSize: "1rem", display: "block", lineHeight: 1}}>APPROVED</span>
                              <span style={{color: "teal", fontSize: "0.8rem", opacity: 0.5}}>by {item?.FromUser?.DisplayName} at {moment(item?.UpdatedAt).format("MM/DD/YYYY h:mm A")}</span>
                            </>
                          : item?.ApprovalStatus === "Rejected" ?
                            <div>
                              <span style={{color: "#E91E63", fontSize: "1rem", display: "block", lineHeight: 1}}>REJECTED</span>
                              <span style={{color: "#E91E63", fontSize: "0.8rem", opacity: 0.5}}>by {item?.FromUser?.DisplayName} at {moment(item?.UpdatedAt).format("MM/DD/YYYY h:mm A")}</span>
                              <Typography.Paragraph
                                ellipsis={{ rows: 5, expandable: true }}
                                title={item?.RejectReason}
                                style={{ display: "block", whiteSpace: "pre-line" }}
                              >
                                {item?.RejectReason}
                              </Typography.Paragraph>
                            </div>
                          : null
                        }
                      </div>
                    : null
                  }
              </>
              }
            />
          ))
        }
        {
          reportData?.Status !== "CLOSED" && formData?.Status !== "CLOSED" && !actionPending ? 
            <Steps.Step
              icon={<Avatar icon={<Image src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${user_data?.Data?.Mail}`} preview={{src: `${sp_site}/_layouts/15/userphoto.aspx?size=L&username=${user_data?.Data?.Mail}`,}} />} />}
              description={
                <div style={{ padding: 2 }}>
                  <Form form={new_comment_form} onFinish={handleAddComment} onFinishFailed={() => message.error("You have to write message!")} disabled={loading}>
                    <Form.Item name="comment_body" style={{ marginBottom: 10 }} rules={[{ required: true, message: '' }]}>
                      <Input.TextArea rows={4} placeholder='write messages' style={{ borderRadius: 7 }} />
                    </Form.Item>
                    {messageType === "Approval" ?
                      <Form.Item name="approval" rules={[{required: true, message: ""}]}>
                        <AutoCompleteOrgUsers valueRender='mail' placeholder="Select approval" />
                      </Form.Item> : null}
                    <Form.Item style={{ margin: 0 }}>
                      <div style={{ float: 'left', display: "flex", gap: 5 }}>
                        <Upload
                          action={`${apiUrl}/uploader/up`}
                          fileList={attachments}
                          onChange={({ fileList: newFileList }) => setAttachments(newFileList)}
                        >
                          {attachments?.length >= 8 ? null : <Button icon={<UploadOutlined />}>Upload</Button>}
                        </Upload>
                        <span style={{marginTop: 4}}>Ask For Approval: <Switch size='small' defaultChecked={false} onChange={(checked) => setMessageType(checked ? "Approval" : "Message")} /></span>
                      </div>
                        <Button style={{ float: 'right' }} type='primary' htmlType='submit' icon={<SendOutlined />} loading={loading}>Send</Button>
                    </Form.Item>
                  </Form>
                </div>
              }
            />
          : null
        }

        {
          reportData?.Status !== "CLOSED" && formData?.Status !== "CLOSED" && actionPendingWithMe ? (
            <Steps.Step 
              icon={<Avatar icon={<Image src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${user_data?.Data?.Mail}`} preview={{src: `${sp_site}/_layouts/15/userphoto.aspx?size=L&username=${user_data?.Data?.Mail}`,}} />} />}
              description={<ApproveAction taskConvId={actionPendingWithMe?.Id} onFinish={() => onFinish(formData?.Id)} />}
            />
          ) : null
        }
      </Steps>
    </div>
  )
}



const CloseDepartmentAction = ({ IncidentId, TaskId, onFinish }) => {
  const { user_data } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleCloseDepartment = async (values) => {
    try {
      setLoading(true);
      const payload = {
        "close_feedback": values.close_message,
        "Email": user_data.Data.Mail,
        "Incident_Id": IncidentId,
        "incident_task_id": TaskId
      };
      await axios.post(`${apiUrl}/Incidents/CloseIncidentById`, payload);
      message.success("Department closed successfully!");
      form.resetFields();
      setVisible(false);
      if(onFinish) onFinish(TaskId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  }


  return (
    <>
      <Button danger onClick={() => setVisible(true)} loading={loading}>Close Conversation</Button>
      <Modal
        title="Close Department"
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCloseDepartment} onFinishFailed={() => message.error("You have to write close message!")} layout='vertical' disabled={loading}>
          <Form.Item name="close_message" label="Close Message" rules={[{ required: true, message: '' }]}>
            <Input.TextArea placeholder='write close message' size='large' rows={4} />
          </Form.Item>
          <Form.Item style={{ margin: 0, textAlign: "right" }}>
            <Button type='default' style={{marginRight: 4}} onClick={() => setVisible(false)}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={loading}>Close</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}