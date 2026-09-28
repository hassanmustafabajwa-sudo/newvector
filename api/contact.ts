import type {VercelRequest,VercelResponse} from '@vercel/node'
export default async function handler(req:VercelRequest,res:VercelResponse){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'})
  const b=req.body??{}
  if(!b.name||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(b.email))||!b.company||!b.details||!Array.isArray(b.services)||!b.services.length)
    return res.status(400).json({error:'Please complete all required fields.'})
  const url=process.env.CONTACT_WEBHOOK_URL
  if(!url)return res.status(503).json({error:'Form backend is not configured yet. Set CONTACT_WEBHOOK_URL.'})
  try{
    const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...b,receivedAt:new Date().toISOString()})})
    if(!r.ok)return res.status(502).json({error:'The form provider rejected the submission.'})
    return res.status(200).json({ok:true})
  }catch{return res.status(502).json({error:'Could not reach the form provider.'})}
}
