import React, { useContext, useRef, useState } from 'react';
import { Button, Col, Divider, Form, Input, message, Modal, notification, Row, Select, Space, Table, Typography } from 'antd';
import { FileTextOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useEffect } from 'react';
import AntdLoader from '../../../../../../Global/AntdLoader/AntdLoader';
import { AppCtx, apiUrl } from '../../../../../../App';
import { AutoCompleteOrgUsers } from 'salic-react-components';

const NewDeliveryLetter = ({ assets }) => {
  const { user_data } = useContext(AppCtx);
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({ Category: 'All', Type: 'All', Brand: 'All', TagNumber: '' });
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [selectedAssets, setSelectedAssets] = useState([]);


  useEffect(() => {
    const data = assets?.filter(row => {
      if(
          (formValues.Category == row.CategoryType || formValues.Category === "All") &&
          (formValues.Type == row.Type || formValues.Type === "All") &&
          (formValues.Brand == row.Brand || formValues.Brand === "All") &&
          row.TagNumber?.includes(formValues.TagNumber?.trim()==""||!formValues.TagNumber ? "" : formValues.TagNumber)
        ) {
          return true;
        } 
        return false;
    })
    setFilteredAssets(data);
  }, [JSON.stringify(formValues)]);


  var types = new Set();
  var uniqueTypes = assets?.filter((m) => {
    if (types.has(m.Type)) {
      return false;
    }
    types.add(m.Type);
    return true;
  });
  var brands = new Set();
  var uniqueBrands = assets?.filter((m) => {
    if (brands.has(m.Brand)) {
      return false;
    }
    brands.add(m.Brand);
    return true;
  });
  var categories = new Set();
  var uniqueCategories = assets?.filter((m) => {
    if (categories.has(m.CategoryType)) {
      return false;
    }
    categories.add(m.CategoryType);
    return true;
  });


  const submitForm = async (values) => {
    try {
      setLoading(true);
      const Assets = selectedAssets?.map(row => {
        var isNew = Number(row.Id) < 1;
        return {
          IsNew: isNew,
          Id: isNew ? "-1" : row.Id,
          Value: isNew ? row.Name : row.Id,
        }
      });
      if(Assets.length === 0) {
        message.error('fill form correctly');
        return;
      }
      const data = {
        Email: user_data.Data.Mail,
        ToUser: values.assetsTo,
        Assets: JSON.stringify(Assets)
      }
      const response = await axios.post(`${apiUrl}/Asset/NewDeliveryNote`, data);
      message.success(response?.data?.Message || 'Delivery letter sent successfully');
      setSelectedAssets([]);
      form.resetFields();
    } catch (error) {
      message.error(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }



  // to add new asset
  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const addItem = (e) => {
    e.preventDefault();
    setFilteredAssets([{Id: (new Date().getTime() * -1).toString(), Name: name, SubDevices: "[]"}, ...filteredAssets]);
    setName('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };



  return (
    <>
      <Button type='primary' onClick={() => setOpenModal(true)}>New Delivery Letter</Button>
      <Modal
        title={<><FileTextOutlined /> New Delivery Letter</>}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        width={1000}
        footer={null}
      >
        <Form
          form={form}
          layout='vertical'
          onFinish={submitForm}
          onFinishFailed={() => message.error("Fill form correctly")}
          onValuesChange={(changedValues, allValues) => setFormValues(allValues)}
          disabled={loading}
        >
          <Row gutter={10}>
            <Col xs={24} md={12} lg={6}>
              <Form.Item name="Category" label="Category" initialValue="All">
                <Select 
                  size='large' 
                  options={[{value: 'All'}, ...uniqueCategories.map(e => { return {value: e.CategoryType} })]} 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item name="Type" label="Type" initialValue="All">
                <Select 
                  size='large' 
                  options={[{value: 'All'}, ...uniqueTypes.map(e => { return {value: e.Type} })]} 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item name="Brand" label="Brand" initialValue="All">
                <Select 
                  size='large' 
                  options={[{value: 'All'}, ...uniqueBrands.map(e => { return {value: e.Brand} })]} 
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Form.Item name="TagNumber" label="Tag Number">
                <Input placeholder="write tag number" size='large' />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={`Availabe Assets ( ${filteredAssets.length} )`}>
            <Select
              size='large' 
              placeholder="Select Assets"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }} >
                    <Input placeholder="type asset name" ref={inputRef} value={name} onChange={onNameChange} />
                    <Button type="text" icon={<PlusOutlined />} onClick={name.length >= 3 ? addItem : () => message.info("Asset name must be at least 3 character")}>
                      Add Asset
                    </Button>
                  </Space>
                </>
              )}
              options={filteredAssets.map(row => {return {value: row.Id, label: row.Name}})}
              onChange={(e) => {
                if(selectedAssets.filter(row => row.Id == e).length === 0 || e == "-1") {
                  setSelectedAssets(prev => [...prev, ...filteredAssets.filter(row => row.Id === e)])
                } else message.info("Already there!")
              }}
            />

          </Form.Item>
          <Table 
            columns={[
              {title: '#', dataIndex: '', render: (_, record) => <span>{`${selectedAssets?.indexOf(record)+1}`}</span>, width: '5%'},
              {
                title: 'Item', 
                dataIndex: 'Name', 
                render: (val, record) => <>
                  <Typography.Title level={5}>{val}</Typography.Title>
                  {
                    record.SubDevices && record.SubDevices !== ""
                    ? (
                      JSON.parse(record.SubDevices)?.length > 0 && <Typography.Text style={{color: '#a4a4a4'}}>Related devices: <ol>{JSON.parse(record.SubDevices)?.map(row => <li>{row.name}</li>)}</ol></Typography.Text>
                    ) : (
                      null
                    )
                  }
                </>, 
                width: '80%'
              },
              {
                title: 'Action', 
                dataIndex: 'Id', 
                render: (_, record) => <Typography.Link type='danger' onClick={() => setSelectedAssets(prev => prev.filter(row => row.Name != record.Name))}>Delete</Typography.Link>, width: '15%'
              },
            ]} 
            dataSource={selectedAssets} 
            pagination={false}
            style={{marginBottom: 20}}
          />
          <Form.Item name="assetsTo" label="Deliver above assets to" rules={[{ required: true, message: "" }]}>
            <AutoCompleteOrgUsers allowClear valueRender='mail' size='large' placeholder="employee name" />
          </Form.Item>
          <div style={{marginTop:30,display:"flex",justifyContent:"flex-end",gap:4}}>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={loading}>Submit</Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}


const Index = () => {
  const [assets, setAssets] = useState([]);
  const fetchAssets = () => {
    axios({
      method: 'GET',
      url: `${apiUrl}/Asset/GetAssets`
    }).then((response) => {
      setAssets(response.data.Data);
    })
  }
  useEffect(() => { fetchAssets(); }, []);

  if(assets.length === 0) return <AntdLoader />;
  return (
    <NewDeliveryLetter assets={assets} setAssets={setAssets} />
  )
}

export default Index