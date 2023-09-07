import React from 'react';
import { Button, Drawer, Form, Input, InputNumber, Select, message } from 'antd';
import pnp from 'sp-pnp-js';
import AddSelectItem from '../../9Boxs/ITServices/Assets/components/AddSelectItem';
import { roundedNum } from '../../Global/roundedNum';
import { PlusOutlined } from '@ant-design/icons';


const StrategyCreateItem = ({ onFinish, quarter, year }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [statusList, setStatusList] = React.useState(['Completed', 'In progress', 'On-hold']);

  const handleSubmit = async (form_values) => {
    setLoading(true);
    try {
      form_values['Quarter'] = quarter;
      form_values['Year'] = year;
      form_values['Title'] = 'BoD Strategy - ' + quarter + ' ' + year;
      if(!isNaN(form_values.Progress)) form_values.Progress = roundedNum(form_values.Progress / 100);
      if(!isNaN(form_values.PreviousQuarter)) form_values.PreviousQuarter = roundedNum(form_values.PreviousQuarter / 100);
      const item_resp = await pnp.sp.web.lists.getByTitle('BoD Strategy').items.add(form_values);
      if(onFinish) onFinish({ ...item_resp?.data, Progress: form_values.Progress, PreviousQuarter: form_values.PreviousQuarter });
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
          <Form.Item name="Project" label="Project">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="ProjectManager" label="Project Manager">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Progress" label="Progress">
            <InputNumber step={1} size='large' placeholder='Enter a number' formatter={(value) => `${value}%`} parser={(value) => value?.replace('%', '')} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="PreviousQuarter" label="Previous Quarter">
            <InputNumber step={1} size='large' placeholder='Enter a number' formatter={(value) => `${value}%`} parser={(value) => value?.replace('%', '')} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="ExpectedCompletionDate" label="Expected Completion Date">
            <Input size="large" placeholder='write here' />
          </Form.Item>
          <Form.Item name="Status" label="Status">
            <Select
              placeholder="Select status" size="large"
              options={statusList?.map((item) => ({label: item, value: item }))}
              dropdownRender={menu => <AddSelectItem menu={menu} setItems={setStatusList} />}
            />
          </Form.Item>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end', marginTop: 25 }}>
            <Button type='primary' loading={loading} size='large' htmlType='submit'>Submit</Button>
            <Button type='primary' danger size='large' onClick={() => setOpenDrawer(false)}>Cancel</Button>
          </div>
        </Form>
      </Drawer>
    </>
  )
}

export default StrategyCreateItem