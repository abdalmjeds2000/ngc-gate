import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import HistoryNavigation from '../../Global/HistoryNavigation/HistoryNavigation';


const PageNotFound = () => {
  let navigate = useNavigate();

  return (
    <>
      <HistoryNavigation>
        <p>Page Not Found</p>
      </HistoryNavigation>
      <div className='standard-page'>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary" onClick={() => navigate("/home")}>Back Home</Button>}
        />
      </div>
    </>
  )
}

export default PageNotFound