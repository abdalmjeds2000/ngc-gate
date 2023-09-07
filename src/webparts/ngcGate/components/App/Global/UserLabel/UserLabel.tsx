import * as React from "react";
import "./styles.css";
import { Avatar } from "antd";
import { AppCtx } from "../../App";


type Props = {
  name: string,
  email: string,
  isActive?: boolean,
  extraText?: string,
  onClick?: () => void
}

const UserLabel = (props: Props) => {
  const { sp_site } = React.useContext(AppCtx);

  return (
    <div className={`user-label ${props.isActive ? "active" : ""}`} onClick={props.onClick} title={props.name}>
      {props.email ? <div className="user-label__image">
        <Avatar src={`${sp_site}/_layouts/15/userphoto.aspx?size=M&username=${props.email}`} alt={props.name} />
      </div> : null}
      {props.name ? <div className="user-label__name">{props.name}</div> : null}
      {props.extraText ? <div>{props.extraText}</div> : null}
    </div>
  )
}

export default UserLabel