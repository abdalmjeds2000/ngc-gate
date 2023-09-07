import React from 'react';
import { Button, Form, Select, Typography, message } from 'antd';
import pnp from 'sp-pnp-js';
import DropdownSelectUserNoLabel from '../../../Global/DropdownSelectUser/DropdownSelectUserNoLabel';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const CreateForm = ({ listName }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [sectors, setSectors] = React.useState([]);

  const fetchSectors = async () => {
    try {
      setLoading(true);
      const sectors = await axios.get('https://salicapi.com/api/User/GetCommunicationList');
      const _sectors = [];
      sectors.data?.Data?.forEach(s => {
        if(_sectors.filter(_s => _s?.name === s?.sector)?.length > 0) return;
        _sectors.push({ name: s?.sector });
      });
      setSectors(_sectors);
    } catch (error) {
      message.error('Something went wrong, please try again later');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { fetchSectors(); }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    for(let i = 0; i < values.sectors.length; i++) {
      const sector = values?.sectors[i];
      // if is thier duplicate sector name in the list, then return error
      if(values?.sectors?.filter(s => s.SectorName === sector.SectorName).length > 1) {
        message.error('Please, remove the duplicated sector name');
        setLoading(false);
        return;
      }
      // check if achievement or challenge lenght is 1 and the value is null or empty string
      if(sector.SectorName === null || sector.SectorName === '') {
        message.error('Please, fill the required fields');
        setLoading(false);
        return;
      }

      // send request to create item in the list
      let payload = { Title: sector.SectorName };
      if(sector.SectorAdmin) {
        const getuserid = await pnp.sp.web.siteUsers.getByEmail(sector.SectorAdmin).get();
        payload.SectorAdminId = getuserid.Id;
      }
      await pnp.sp.web.lists.getByTitle(listName).items.add(payload);
    }
    // handle success
    message.success('Invitations sent successfully');
    form.resetFields();
    form.setFieldsValue({ sectors: [{ SectorName: null, SectorAdmin: null }] });
    setLoading(false);
  }

  // const sectors = [
  //   { name: 'Sector 1' },
  //   { name: 'Sector 2' },
  //   { name: 'Sector 3' },
  //   { name: 'Sector 4' },
  //   { name: 'Sector 5' },
  // ];

  return (
    <div>
      <div style={{ marginBottom: 10}}>
        <Typography.Text style={{ display: 'block', fontSize: '1.2rem', fontWeight: 500 }}>
          Send Invitation to sectors to fill thier achievement & challenge.
        </Typography.Text>
      </div>
      <Form
        name='achievements_challenges_invitations'
        layout='vertical'
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={() => message.error('Please, fill the required fields')}
        disabled={loading}
      >
        <Form.List name="sectors" initialValue={[{ SectorName: null, SectorAdmin: null }]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div key={key} style={{ background: '#f6f6f6', padding: 20, borderRadius: 6, border: '1px solid #ddd', position: 'relative', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
                  <Form.Item
                    {...restField} name={[name, 'SectorName']} label="Sector Name" style={{ flex: 1, minWidth: 300, margin: 0 }}
                    rules={[ { required: true, message: '' } ]}
                  >
                    <Select
                      showSearch
                      size='large'
                      placeholder="Select Sector"
                      optionFilterProp="children"
                      filterOption={(input, option) => option?.children?.toLowerCase().indexOf(input?.toLowerCase()) >= 0}
                    >
                      {sectors.map((sector, indx) => <Select.Option key={indx} value={sector?.name}>{sector?.name}</Select.Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item {...restField} label="Sector Admin" style={{ flex: 1, minWidth: 300, margin: 0 }}>
                    <DropdownSelectUserNoLabel name={[name, 'SectorAdmin']} required={false} placeholder="Select Sector Admin" />
                  </Form.Item>
                  {fields.length > 1 ? <span style={{ position: 'absolute', top: -10, right: 20 }}>
                    <Button type='primary' danger size='small' onClick={() => remove(name)}>Remove</Button>
                  </span> : null}
                </div>
              ))}
              <Form.Item>
                <Button type="dashed" size='large' onClick={add} icon={<PlusOutlined />}>
                  Add sector
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
          <Button type='link' size='large' htmlType='reset'>Reset</Button>
          <Button type='primary' size='large' htmlType='submit' loading={loading}>Send Invitations</Button>
        </div>
      </Form>
    </div>
  )
}

export default CreateForm