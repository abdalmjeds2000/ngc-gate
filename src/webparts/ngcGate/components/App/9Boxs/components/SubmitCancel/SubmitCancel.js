import React from 'react'
import { Button, Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom';

function SubmitCancel(props) {
  const navigate = useNavigate();
  return (
    <Row gutter={10} justify="center">
      {
        !props.isUpdate
        ? <Col>
            <Button type="primary" htmlType='submit' loading={props.loaderState} onClick={props.formSubmitHandler}>
              {props.isUpdate ? "Update" : "Submit"}
            </Button>
          </Col>
        : null
      }
      <Col>
        <Button danger type="primary" onClick={() => navigate(`${props.backTo || '/admin-services'}`)}>
          Cancel
        </Button>
      </Col>
    </Row>
  )
}

export default SubmitCancel