import React, { useContext } from 'react';
import { Avatar, Tree } from 'antd';
import "./teamtree.styles.css";
import { AppCtx } from '../../../../../App';

const TeamTree = ({ showNames=true, allKeys, treeData, setSelectedUsers }) => {
  const { sp_site } = useContext(AppCtx);
  
  const onSelect = (keys, info) => {
    setSelectedUsers(info.selectedNodes);
  };

  return (
    <Tree
      multiple
      showLine
      onSelect={onSelect}
      treeData={treeData}
      defaultExpandedKeys={allKeys}
      fieldNames={{ title: 'DisplayName', key: 'Id', children: 'DirectUsers' }}
      className={`it-teamtree ${!showNames ? 'minimize' : ''}`}
      defaultSelectedKeys={allKeys}
      titleRender={(nodeData) => {
        return (
          <div style={{display:"flex", alignItems:"center"}}>
            <Avatar
              size="small"
              src={`${sp_site}/_layouts/15/userphoto.aspx?size=s&username=${nodeData.Mail}`}
            />
            {showNames ? <span className='teamtree_username'>{nodeData.DisplayName}</span> : null}
          </div>
        );
      }}
    />
  );
};

export default TeamTree