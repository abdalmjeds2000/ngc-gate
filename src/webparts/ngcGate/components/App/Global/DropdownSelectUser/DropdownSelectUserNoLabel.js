import React, { useContext, useState } from 'react';
import { Avatar, Form, Image, Select } from 'antd';
import fetchUsers from './fetchUsers';
import { AppCtx } from '../../App';

const OptionCard = ({ DisplayName, Email }) => {
  const { sp_site } = useContext(AppCtx);

  return(
    <div style={{display: 'flex', alignItems: 'center', gap: 2}}>
      <Avatar
      size='small'
        src={
          <Image
            width={18}
            src={`${sp_site}/_layouts/15/userphoto.aspx?size=S&username=${Email}`}
            preview={{src: `${sp_site}/_layouts/15/userphoto.aspx?size=L&username=${Email}`,}}
          />
        }
      />
      <div>
        <span style={{ fontWeight: 300 }}><b>{DisplayName}</b></span>
      </div>
    </div>
  )
}


function DropdownSelectUserNoLabel(props) {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);

  const fetch = async (value) => {
    if(value.length >= 3) {
      const response = await fetchUsers(value);
      const values = response.data.Data.value;
      const selectOptions = values?.map(value => ({
        value: value.mail, 
        label: <OptionCard DisplayName={value.displayName} Email={value.mail} />
      }));
      setOptions(selectOptions);
    }
  };
  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue);
    } else {
      setOptions([]);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  const debounceOnSearch = debounce((value) => {
    handleSearch(value);
  }, 1000);




  return (
    <Form.Item name={props.name} style={{marginBottom: 0}} initialValue={props.initialValue || null} rules={[{ required: props.required, message: false }]}>
      <Select
        showSearch
        value={value}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        // onSearch={handleSearch}
        onSearch={debounceOnSearch}
        onChange={newValue => setValue(newValue)}
        disabled={props.isDisabled}
        size={props.size || 'large'}
        style={{ width: '100%' }}
        options={options}
        placeholder={props.placeholder}
        loading={props?.isLoading}
        onBlur={props.onBlur}
        {...props}
      />
    </Form.Item>
  )
}

export default DropdownSelectUserNoLabel