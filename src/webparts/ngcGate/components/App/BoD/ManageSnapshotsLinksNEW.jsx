import React from 'react'
import { Button, Form, Modal, Select, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import pnp from 'sp-pnp-js';
import TextArea from 'antd/lib/input/TextArea';


const ManageSnapshotsLinks = () => {
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pagesList, setPagesList] = React.useState([]);
  const [selectedPage, setSelectedPage] = React.useState(null);

  const getPages = async () => {
    setLoading(true);
    try {
      const pages = await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.get();
      setPagesList(pages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }
  React.useEffect(() => { getPages(); }, []);


  React.useEffect(() => {
    const page = pagesList?.find(page => page?.Id === selectedPage);
    if (page) {
      form.setFieldsValue({
        Title: page.Title,
        ReportId: page.ReportId,
        GroupId: page.GroupId,
      });
    }
  }, [selectedPage]);

  const handleUpdateLink = async (values) => {
    setLoading(true);
    try {
      await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.getById(selectedPage).update({ ReportId: values.ReportId, GroupId: values.GroupId });
      const newPagesList = pagesList?.map(page => {
        if (page.Id === selectedPage) {
          return { ...page, ReportId: values.ReportId, GroupId: values.GroupId };
        }
        return page;
      });
      setPagesList(newPagesList);
      setLoading(false);
      message.success('Link updated successfully');
      setOpenModal(false);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Button type='primary' icon={<LinkOutlined />} onClick={() => setOpenModal(true)}>
        Previews
      </Button>

      <Modal
        title="Manage Previews"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        destroyOnClose
        footer={null}
      >
        <Form layout='vertical' form={form} disable={!selectedPage}>
          <Form.Item name="Title" label="Page"  rules={[{ required: true, message: "" }]}>
            <Select
              placeholder="Select a page"
              allowClear
              showSearch
              size='large'
              onChange={setSelectedPage}
              optionFilterProp="children"
              filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}
            >
              {pagesList.map(page => <Select.Option key={page.Id} value={page.Id}>{page.Title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="ReportId" label="Report Id" rules={[{ required: true, message: "" }]}>
            <TextArea rows={1} size='large' placeholder="enter report id" />
          </Form.Item>
          <Form.Item name="GroupId" label="Group Id" rules={[{ required: true, message: "" }]}>
            <TextArea rows={1} size='large' placeholder="enter report group id" />
          </Form.Item>
          <Form.Item style={{margin: 0}}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType='submit' onClick={handleUpdateLink} loading={loading}>
                Save
              </Button>
              <Button onClick={() => setOpenModal(false)} style={{ marginLeft: 8 }}>
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ManageSnapshotsLinks