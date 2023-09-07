import React from 'react';
import { Button, Checkbox, Drawer, Form, Input, InputNumber, Select, message } from 'antd';
import pnp, { Web } from 'sp-pnp-js';
import { PlusOutlined } from '@ant-design/icons';
import DropdownSelectUserNoLabel from '../../Global/DropdownSelectUser/DropdownSelectUserNoLabel';


const removeDuplicated = (arr) => {
  const unique = arr
    .map(e => e['field_3'])
    .map((e, i, final) => final.indexOf(e) === i && i)
    .filter(e => arr[e]).map(e => arr[e]);
  return unique;
}



const CreateItem = ({ listName, statusOptions, onFinish }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [kpis, setKpis] = React.useState([]);

  const getKpis = async () => {
    try {
      const web = new Web('https://salic.sharepoint.com/sites/MDM');
      const kpis = await web.lists.getByTitle('KPIs Data').items.select('field_3,field_4').get();
      setKpis(kpis);
    } catch (error) {
      console.log(error);
    }
  }
  React.useEffect(() => { 
    if(openDrawer && kpis.length === 0) {
      getKpis();
    }
  }, [openDrawer]);


  const uniqueKpis = removeDuplicated(kpis);
  const options = uniqueKpis.map((kpi, i) => ({
    key: `${i}__${kpi.field_3}`,
    label: kpi.field_3,
    options: kpis?.filter(k => k.field_3 === kpi.field_3)?.map((k, ii) => ({ 
      key: `${ii}__${kpi.field_3}__${k.field_4}`,
      label: k.field_4, value: k.field_4 })), 
  }));


  const handleSubmit = async (form_values) => {
    setLoading(true);
    try {
      let payload = {};
      if(form_values.Responsible) {
        const getuserid = await pnp.sp.web.siteUsers.getByEmail(form_values.Responsible).get();
        delete form_values.Responsible;
        payload.ResponsibleId = getuserid.Id;
      }
      payload = { ...payload, ...form_values };
      await pnp.sp.web.lists.getByTitle(listName).items.add(payload);
      if(onFinish) onFinish();
      setLoading(false);
      form.resetFields();
      message.success('Item added successfully!');
      setOpenDrawer(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Button type='primary' size='small' onClick={() => setOpenDrawer(true)} icon={<PlusOutlined />} loading={loading}>New</Button>
      <Drawer title="Add New Items" width={500} placement="right" onClose={() => setOpenDrawer(false)} open={openDrawer}>
        <Form form={form} layout='vertical' disabled={loading} onFinish={handleSubmit} onFinishFailed={() => message.error('Please, fill all required fields!')}>
          <Form.Item name='Status' label='Status' rules={[{ required: true }]}>
            <Select size='large' placeholder='select an Status' options={statusOptions} />
          </Form.Item>
          <Form.Item name='Title' label='KPI' rules={[{ required: true }]}>
            <Select 
              size='large' placeholder='select an KPI' 
              allowClear 
              showSearch
              filterOption={(input, option) => option?.label?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}
              options={options}
            />
          </Form.Item>
          <Form.Item label='Responsible'>
            <DropdownSelectUserNoLabel name="Responsible" required={false} placeholder="Select a user" />
          </Form.Item>
          <Form.Item name='Issue' label='Issue' rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder='Issue' />
          </Form.Item>
          <Form.Item name="AddManagmentSupport" valuePropName="checked">
            <Checkbox>Add Management Support?</Checkbox>
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginTop: 25 }}>
            <Button type='primary' loading={loading} size='large' htmlType='submit'>Submit</Button>
            <Button type='primary' danger size='large' onClick={() => {form.resetFields(); setOpenDrawer(false);}}>Cancel</Button>
          </div>
        </Form>
      </Drawer>
    </>
  )
}

export default CreateItem