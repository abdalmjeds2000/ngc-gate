import React, { useEffect } from 'react';
const editStyle = () => {
  try {
    var iframe = document.getElementById("spIframe");
    var elmnt = iframe.contentWindow.document.getElementsByClassName("od-ItemsScopeList-content")[0];
    elmnt.style.backgroundColor = "#fff";
    var btn = iframe.contentWindow.document.getElementsByClassName("od-ItemContent-header")[0].children[1];
    btn.style.visibility = "hidden";
  } catch {
    console.log('failed hide some elements in Organization iframe');
  }
}


function Organization() {

  useEffect(() => {
    document.title = '.:: SALIC Gate | Organization ::.';
  }, []);


  return (
    <div>
      <iframe 
        // src='https://salic.sharepoint.com/sites/newsalic/KSA/Forms/AllItems.aspx?RootFolder=%2Fsites%2Fnewsalic%2FKSA%2FKSA&FolderCTID=0x0120007CD8E886399EDB4DAEC9E86769C478E4' 
        src='https://salic.sharepoint.com/sites/newsalic/KSA/Forms/Tiles.aspx?id=%2Fsites%2Fnewsalic%2FKSA%2FKSA&viewid=942be927%2Da77a%2D4394%2Dbf20%2D638b393dd868' 
        width='100%'
        id='spIframe'
        onLoad={editStyle}
      >
      </iframe>
    </div>
  )
}

export default Organization