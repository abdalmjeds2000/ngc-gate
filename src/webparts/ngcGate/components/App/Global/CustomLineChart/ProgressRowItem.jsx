import React from 'react';

const ProgressRowItem = ({type, title, desc, count, onClickLabel, customColor}) => {

  return (
    <div className='row-item'>
      <div class={`row-item-legend bg-${type}`} style={{backgroundColor: customColor || '#bbb'}}></div>
      <div class="row-item-desc">
        <a onClick={onClickLabel} class="user_chart_status">
          <span class="row-item-title">{title || '-'}</span>
        </a>
        <div class="row-item-desc">{desc || '-'}</div>
      </div>
      <div class="row-item-count">
        <span id="not-started-task">{count || 0}</span>
      </div>
    </div>
  )
}

export default ProgressRowItem