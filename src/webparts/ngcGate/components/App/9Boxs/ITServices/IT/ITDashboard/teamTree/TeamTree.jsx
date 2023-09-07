import React from 'react';
import { Avatar, Tree } from 'antd';
import "./teamtree.styles.css";

const TeamTree = ({ showNames=true, allKeys, treeData, setSelectedUsers }) => {

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
              src={`https://salic.sharepoint.com/sites/portal/_layouts/15/userphoto.aspx?size=s&username=${nodeData.Mail}`}
            />
            {showNames ? <span className='teamtree_username'>{nodeData.DisplayName}</span> : null}
          </div>
        );
      }}
    />
  );
};

export default TeamTree