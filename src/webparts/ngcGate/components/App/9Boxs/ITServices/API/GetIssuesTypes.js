import pnp from 'sp-pnp-js';

export default async function GetIssuesTypes() {
  try {
    const res = await pnp.sp.web.lists.getByTitle('Issues Types')
      .items.select('AttachmentFiles,*').expand('AttachmentFiles').get()
    return res
  } catch(err) {
    console.log(err)
    return(err)
  }
}