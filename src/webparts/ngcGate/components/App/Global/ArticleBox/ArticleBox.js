import React from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './ArticleBox.css';


function ArticleBox(props) {
  const navigate = useNavigate();

  return (
    <div className='news-box'>
      <div className='img' style={{backgroundImage: `url("${props.Poster}")`, ...props.customImgStyle}}></div>
      <h2 onClick={() => navigate(props.To)}>
        {props.Title}
      </h2>
      <p><div dangerouslySetInnerHTML={{__html: props.Description?.replace(/<[^>]*>/g, '')}}></div></p>
      
      {props.date && <Typography.Text type='secondary'><CalendarOutlined /> {props.date}</Typography.Text>}
      <div>
        {
          props.Tags !== undefined && props.Tags.length > 0
          ? props.Tags.map((tag, i) => <Tag key={i} color="#108ee9">{tag}</Tag>)
          : null
        }
      </div>
      <a onClick={() => navigate(props.To)}>More</a>
    </div>
  )
}


export default ArticleBox
