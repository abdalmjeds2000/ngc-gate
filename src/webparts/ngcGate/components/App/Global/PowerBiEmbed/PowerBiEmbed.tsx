import * as React from 'react'
import AntdLoader from '../AntdLoader/AntdLoader';
import { AppCtx } from '../../App';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';
import axios from "axios";
import { Alert } from 'antd';

type PowerBIEmbedProps = {
  reportId: string;
  groupId: string;
  iframeClassName?: string;
}

const PowerBiEmbedComponent = (props: PowerBIEmbedProps & {authToken: string}) => {
  const [embedToken, setEmbedToken] = React.useState(null);
  const [error, setError] = React.useState(null);
  const getToken = async () => {
    try {
      const response = await axios({
        url: `https://api.powerbi.com/v1.0/myorg/groups/${props.groupId}/reports/${props.reportId}/GenerateToken`,
        method: 'POST',
        headers: { 
          // 'authority': 'api.powerbi.com', 
          'authorization': "Bearer " + props.authToken,
        },
        data: {
          "accessLevel": "View",
          "allowSaveAs": true,
          "identities": [],
          "lifetimeInMinutes": 3000
        }
      });
      setEmbedToken(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  React.useEffect(() => {
    getToken().catch(error => console.log(error));
  }, []);
  
  if(error) return <Alert type="error" message="Something went wrong" banner />
  if(!embedToken) return <AntdLoader customStyle={{}} label="Wait a moment" />;
  return (
    <PowerBIEmbed
      embedConfig = {{
        type: 'report',
        id: props.reportId,
        embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${props.reportId}&groupId=${props.groupId}`,
        accessToken: embedToken?.token,
        tokenType: models.TokenType.Embed,
        settings: {
          background: models.BackgroundType.Default,
          panes: {
            filters: {
              expanded: true,
              visible: true,
            },
          },
        },
      }}
      cssClassName={props.iframeClassName}
    // eventHandlers = { 
    //   new Map([
    //     ['loaded', function () {console.log('Report loaded');}],
    //     ['rendered', function () {console.log('Report rendered');}],
    //     ['error', function (event) {console.log(event);}]
    //   ])
    // }
  />
  )
}



const Main = (props: PowerBIEmbedProps) => {
  const { powerBiToken } = React.useContext(AppCtx);

  if(!powerBiToken) return <AntdLoader customStyle={{}} label="Wait a moment" />;

  return (
    <PowerBiEmbedComponent
      authToken={powerBiToken} 
      reportId={props.reportId}
      groupId={props.groupId}
      iframeClassName={props.iframeClassName}
    />
  )
}

export default Main