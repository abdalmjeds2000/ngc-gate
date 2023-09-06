import * as React from "react";
import "./styles.css";
import { Avatar } from "antd";


type Props = {
  name: string,
  email: string,
  isActive?: boolean,
  extraText?: string,
  onClick?: () => void
}

const UserLabel = (props: Props) => {
  return (
    <div className={`user-label ${props.isActive ? "active" : ""}`} onClick={props.onClick} title={props.name}>
      {props.email ? <div className="user-label__image">
        <Avatar src={`https://salic.sharepoint.com/sites/portal/_layouts/15/userphoto.aspx?size=M&username=${props.email}`} alt={props.name} />
      </div> : null}
      {props.name ? <div className="user-label__name">{props.name}</div> : null}
      {props.extraText ? <div>{props.extraText}</div> : null}
    </div>
  )
}

export default UserLabel