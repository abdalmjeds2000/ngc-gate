import React from 'react'
import { Button, Form, Modal, Select, message } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import pnp from 'sp-pnp-js';
import TextArea from 'antd/lib/input/TextArea';



const ManageSnapshotsLinks = () => {
  const [openModal, setOpenModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [pagesList, setPagesList] = React.useState([]);
  const [selectedPage, setSelectedPage] = React.useState(null);
  const [link, setLink] = React.useState(null);

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
    if(selectedPage) {
      const page = pagesList?.find(page => page?.Id === selectedPage);
      if (page) setLink(page.PreviewLink);
    }
  }, [selectedPage]);

  const handleUpdateLink = async () => {
    setLoading(true);
    try {
      await pnp.sp.web.lists.getByTitle('BoD Pages Info').items.getById(selectedPage).update({ PreviewLink: link });
      const newPagesList = pagesList?.map(page => {
        if (page.Id === selectedPage) {
          return { ...page, PreviewLink: link };
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
        <Form layout='vertical'>
          <Form.Item label="Page" required>
            <Select
              placeholder="Select a page"
              allowClear
              showSearch
              value={selectedPage}
              onChange={setSelectedPage}
              optionFilterProp="children"
              disabled={loading}
              filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}
            >
              {pagesList.map(page => <Select.Option key={page.Id} value={page.Id}>{page.Title}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="Link" required>
            <TextArea rows={4} placeholder="Enter link" disabled={loading} value={link} onChange={e => setLink(e.target.value)} />
          </Form.Item>
          <Form.Item style={{margin: 0}}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" onClick={handleUpdateLink} loading={loading} disabled={!selectedPage}>
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