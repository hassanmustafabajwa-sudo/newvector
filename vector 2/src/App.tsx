import {useCallback,useEffect,useRef,useState,type FormEvent,type ReactNode} from 'react'
import {AnimatePresence,MotionConfig,motion,useMotionValue,useMotionValueEvent,useScroll,useSpring,useTransform,type MotionValue} from 'framer-motion'
import {CAPS,PROJECTS,SERVICES,STEPS,type Project} from './data'
import {CONTACT} from './config'

const ease=[.2,.8,.2,1] as const
const Art=({p,i}:{p:Project;i:number})=>(<svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${p.name} placeholder artwork`}><rect width="800" height="500" fill={p.a}/>{Array.from({length:14},(_,k)=>(<line key={k} x1={(k*70+i*90)%800} y1={0} x2={(k*110+i*160)%800} y2={500} stroke={p.b} strokeOpacity={.2+(k%5)/10} strokeWidth={1+(k%3)}/>))}<circle cx={250+i*80} cy={250} r={90+i*12} fill={p.b}/><path d={`M0 500 L${300+i*60} 120 L800 500Z`} fill={p.a} fillOpacity={.85}/><text x="34" y="470" fontWeight="800" fontSize="56" fill={p.b}>{p.name}</text></svg>)

const Mask=({children,d=0,on}:{children:ReactNode;d?:number;on?:boolean})=>(<span className="ln"><motion.span initial={{y:'105%'}} {...(on===undefined?{whileInView:{y:0},viewport:{once:true}}:{animate:{y:on?0:'105%'}})} transition={{duration:1,ease,delay:d}}>{children}</motion.span></span>)

function Intro({done}:{done:()=>void}){
  useEffect(()=>{const t=setTimeout(done,2200);addEventListener('keydown',done);return()=>{clearTimeout(t);removeEventListener('keydown',done)}},[done])
  return(<motion.div className="intro" onClick={done} role="button" tabIndex={0} aria-label="Skip intro" initial={{clipPath:'inset(0 0 0% 0)'}} exit={{clipPath:'inset(0 0 100% 0)'}} transition={{duration:1,ease:[.77,0,.18,1]}}>
    <div className="w" aria-hidden>{[...'VECTOR'].map((c,i)=><span key={i}><motion.i initial={{y:'105%'}} animate={{y:0}} transition={{duration:.8,ease,delay:i*.07}}>{c}</motion.i></span>)}</div><small>Click or press any key to skip</small></motion.div>)
}

function Hero({ready}:{ready:boolean}){
  const ref=useRef<HTMLElement>(null)
  const {scrollYProgress:p}=useScroll({target:ref,offset:['start start','end start']})
  const y=useTransform(p,[0,1],['0vh','-14vh']),o=useTransform(p,[0,.8],[1,0]),sc=useTransform(p,[0,1],[1,1.5])
  const rot=useTransform(p,[0,1],[0,28]),mx=useSpring(useMotionValue(0),{stiffness:40,damping:20})
  const r=useTransform([rot,mx],(v)=>(v as number[])[0]+(v as number[])[1])
  return(<section id="top" className="hero wrap" ref={ref} onPointerMove={e=>mx.set((e.clientX/innerWidth-.5)*10)}>
    <motion.div className="rays" aria-hidden style={{rotate:r,scale:sc,opacity:o}}><svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">{Array.from({length:28},(_,i)=>{const a=.5+i*.11;return <line key={i} x1={60} y1={40} x2={60+Math.cos(a)*150} y2={40+Math.sin(a)*150} stroke="#f2f2f0" strokeOpacity={.06+((i*13)%7)/45} strokeWidth=".15"/>})}<circle cx="60" cy="40" r=".6" fill="#f2f2f0"/></svg></motion.div>
    <motion.div className="in" style={{y,opacity:o}}>
      <h1 className="big"><Mask on={ready}>We build digital</Mask><Mask on={ready} d={.12}>experiences that</Mask><Mask on={ready} d={.24}>don't stand still.</Mask></h1>
      <div className="row"><p>We combine design, technology, and strategy to create digital experiences that move businesses forward.</p><div className="btns"><a className="btn" href="#work">Explore our work</a><a className="btn ghost" href="#contact">Start a project</a></div></div>
    </motion.div></section>)
}

function Stmt({p,i,children}:{p:MotionValue<number>;i:number;children:ReactNode}){
  const a=i/3,b=(i+1)/3,inp=[a,a+.06,b-.06,b]
  const o=useTransform(p,inp,[i?0:1,1,1,i<2?0:1]),x=useTransform(p,inp,[i?'8vw':'0vw','0vw','0vw',i<2?'-8vw':'0vw'])
  return <motion.p className="big stm" style={{opacity:o,x}}>{children}</motion.p>
}
function Experience(){
  const ref=useRef<HTMLElement>(null)
  const {scrollYProgress:p}=useScroll({target:ref,offset:['start start','end end']})
  return(<section ref={ref} className="exp" aria-labelledby="exp-h"><div className="st wrap">
    <h2 id="exp-h" className="big" style={{maxWidth:'12ch'}}><Mask>Built to move</Mask><Mask d={.1}>what's next.</Mask></h2>
    <p className="lead">Vector brings design, technology, and performance together to build meaningful digital experiences.</p>
    <Stmt p={p} i={0}>Think beyond the expected.</Stmt><Stmt p={p} i={1}>Design with <span className="serif">intention.</span></Stmt><Stmt p={p} i={2}>Build without limits.</Stmt></div></section>)
}

function Caps(){
  const ref=useRef<HTMLElement>(null),[a,setA]=useState(0)
  const {scrollYProgress:p}=useScroll({target:ref,offset:['start start','end end']})
  useMotionValueEvent(p,'change',v=>setA(Math.min(CAPS.length-1,Math.floor(v*CAPS.length))))
  const go=(i:number)=>{const el=ref.current;if(!el)return;window.scrollTo({top:el.getBoundingClientRect().top+scrollY+(el.offsetHeight-innerHeight)*(i+.5)/CAPS.length,behavior:'smooth'})}
  return(<section id="services" ref={ref} className="caps" aria-labelledby="cap-h"><div className="st wrap">
    <h2 id="cap-h" className="capt">One partner. Every digital advantage.</h2>
    <ol aria-label="Services">{CAPS.map((c,i)=><li key={c[0]}><button type="button" className={i===a?'on':''} aria-current={i===a} onClick={()=>go(i)}>{String(i+1).padStart(2,'0')} {c[0]}</button></li>)}</ol>
    <div className="cs" aria-live="polite"><AnimatePresence mode="wait"><motion.div key={a} className="c" initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-50}} transition={{duration:.45,ease}}>
      <svg viewBox="0 0 200 200" aria-hidden>{Array.from({length:8},(_,k)=><line key={k} x1={k*26} y1={200} x2={(k*26*(a+2))%200} y2={0} stroke="#f2f2f0"/>)}<circle cx={40+a*24} cy={100} r={18+a*4} fill="none" stroke="#f2f2f0"/></svg>
      <h3 className="big">{CAPS[a][0]}</h3><p>{CAPS[a][1]}</p></motion.div></AnimatePresence></div></div></section>)
}

function Work({open}:{open:(id:string)=>void}){
  return(<section id="work" className="wrap hd" aria-labelledby="w-h"><h2 id="w-h" className="big" style={{maxWidth:'10ch'}}><Mask>Made to make</Mask><Mask d={.1}>an impact.</Mask></h2>
    <p className="mut note">Illustrative concept projects with placeholder artwork. Not verified client engagements. Edit src/data.ts to update.</p>
    <div className="wk">{PROJECTS.map((p,i)=><Project key={p.id} p={p} i={i} open={open}/>)}</div></section>)
}
function Project({p,i,open}:{p:Project;i:number;open:(id:string)=>void}){
  const ref=useRef<HTMLDivElement>(null),{scrollYProgress:s}=useScroll({target:ref,offset:['start end','end start']}),y=useTransform(s,[0,1],['-8%','8%'])
  return(<article className="pj"><motion.button ref={ref as never} className="im" onClick={()=>open(p.id)} aria-label={`Open ${p.name} case study`} initial={{clipPath:'inset(0 100% 0 0)'}} whileInView={{clipPath:'inset(0 0% 0 0)'}} viewport={{once:true,amount:.3}} transition={{duration:1.2,ease:[.77,0,.18,1]}} whileHover={{scale:.985}}><motion.div className="par" style={{y}}><Art p={p} i={i}/></motion.div></motion.button>
    <div className="tx"><span className="mut">{p.cat}</span><h3>{p.name}</h3><a href={`#case-${p.id}`} onClick={e=>{e.preventDefault();open(p.id)}}>View case study</a></div></article>)
}
function Case({p,close}:{p:Project;close:()=>void}){
  const i=PROJECTS.indexOf(p),btn=useRef<HTMLButtonElement>(null)
  useEffect(()=>{btn.current?.focus();const k=(e:KeyboardEvent)=>{if(e.key==='Escape')close()};addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[close])
  const rows:[string,string][]=[['Project overview',p.overview],['Challenge',p.challenge],['Creative direction',p.direction],['Work delivered',p.delivered.join(', ')+'.']]
  return(<motion.section className="case" role="dialog" aria-modal aria-label={`${p.name} case study`} initial={{clipPath:'circle(0% at 50% 100%)'}} animate={{clipPath:'circle(150% at 50% 100%)'}} exit={{clipPath:'circle(0% at 50% 100%)'}} transition={{duration:.9,ease:[.77,0,.18,1]}}><div className="wrap">
    <button ref={btn} className="btn ghost" onClick={close}>Close case study</button><p className="mut" style={{marginTop:40}}>{p.cat}</p><h2 className="big">{p.name}</h2>
    <div className="im static"><Art p={p} i={i}/></div>
    <div className="cols">{rows.map(([h,t])=><div className="cr" key={h}><h4>{h}</h4><p>{t}</p></div>)}</div><p className="mut note">Illustrative concept with placeholder artwork. Replace with real screenshots.</p></div></motion.section>)
}

function Process(){
  const ref=useRef<HTMLDivElement>(null),{scrollYProgress:p}=useScroll({target:ref,offset:['start 70%','end 60%']}),h=useTransform(p,[0,1],['0%','100%'])
  return(<section id="process" className="wrap hd" aria-labelledby="p-h"><h2 id="p-h" className="big" style={{maxWidth:'11ch'}}><Mask>From first thought</Mask><Mask d={.1}>to final experience.</Mask></h2>
    <div className="steps" ref={ref}><div className="rail"><motion.i style={{height:h}}/></div>
      {STEPS.map((s,i)=><motion.div className="stp" key={s[0]} initial={{opacity:.2,x:30}} whileInView={{opacity:1,x:0}} viewport={{amount:.6}} transition={{duration:.7,ease}}><span>Step {i+1}</span><h3>{s[0]}</h3><p>{s[1]}</p></motion.div>)}</div></section>)
}
function Statement(){
  const ref=useRef<HTMLElement>(null),{scrollYProgress:p}=useScroll({target:ref,offset:['start end','end start']}),x1=useTransform(p,[0,1],['20vw','-20vw']),x2=useTransform(p,[0,1],['-15vw','15vw'])
  return(<section ref={ref} className="stmt wrap"><motion.p className="big a" style={{x:x1}}>Good design gets attention.</motion.p><motion.p className="big" style={{x:x2}}>Great experiences <span className="serif">move people.</span></motion.p></section>)
}

type F={name:string;email:string;company:string;url:string;services:string[];budget:string;currency:string;details:string}
const EMPTY:F={name:'',email:'',company:'',url:'',services:[],budget:'',currency:'',details:''}
function Contact(){
  const [f,setF]=useState<F>(EMPTY),[er,setEr]=useState<Record<string,string>>({}),[st,setSt]=useState<{t:'idle'|'loading'|'ok'|'err';m?:string}>({t:'idle'})
  const set=<K extends keyof F>(k:K,v:F[K])=>setF(o=>({...o,[k]:v}))
  const submit=async(e:FormEvent)=>{e.preventDefault();const x:Record<string,string>={}
    if(f.name.trim().length<2)x.name='Enter your full name.'
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email))x.email='Enter a valid work email.'
    if(!f.company.trim())x.company='Enter your company name.'
    if(f.url&&!/^https?:\/\/.+\..+/.test(f.url))x.url='Start the URL with http:// or https://.'
    if(!f.services.length)x.services='Select at least one service.'
    if(!f.budget)x.budget='Choose a budget range.'
    if(f.details.trim().length<10)x.details='Add a few details about the project.'
    setEr(x);if(Object.keys(x).length){setSt({t:'idle'});return}
    setSt({t:'loading'})
    try{const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(f)})
      if(!r.ok){const j=await r.json().catch(()=>({}));throw new Error((j as {error?:string}).error||'Request failed')}
      setSt({t:'ok',m:`Sent. We will reply to ${f.email} soon.`});setF(EMPTY)}
    catch(err){setSt({t:'err',m:`Not sent: ${err instanceof Error?err.message:'network error'}. Try again or use WhatsApp or email.`})}}
  const Fld=({id,label,k,type='text',auto}:{id:string;label:string;k:'name'|'email'|'company'|'url'|'currency';type?:string;auto?:string})=>(<div className="f"><label htmlFor={id}>{label}</label><input id={id} type={type} autoComplete={auto} value={f[k]} onChange={e=>set(k,e.target.value)} aria-invalid={!!er[k]}/><span className="err">{er[k]}</span></div>)
  return(<section id="contact" className="wrap hd" aria-labelledby="c-h"><h2 id="c-h" className="big" style={{maxWidth:'11ch'}}><Mask>Let's build</Mask><Mask d={.1}>something that moves.</Mask></h2>
    <p className="mut" style={{marginTop:20}}>Have an ambitious idea? Tell us where you want to go.</p>
    <form onSubmit={submit} noValidate><Fld id="n" label="Full name" k="name" auto="name"/><Fld id="e" label="Work email" k="email" type="email" auto="email"/><Fld id="co" label="Company" k="company" auto="organization"/><Fld id="u" label="Website URL (optional)" k="url" type="url"/>
      <fieldset className="f w"><legend>Services required</legend><div className="chips">{SERVICES.map(s=><label key={s}><input type="checkbox" checked={f.services.includes(s)} onChange={()=>set('services',f.services.includes(s)?f.services.filter(x=>x!==s):[...f.services,s])}/><span>{s}</span></label>)}</div><span className="err">{er.services}</span></fieldset>
      <div className="f"><label htmlFor="b">Estimated budget</label><select id="b" value={f.budget} onChange={e=>set('budget',e.target.value)}><option value="">Select a range</option><option>Under PKR 150,000</option><option>PKR 150,000 – 500,000</option><option>PKR 500,000 – 1,500,000</option><option>PKR 1,500,000+</option><option>International (state currency)</option></select><span className="err">{er.budget}</span></div>
      <Fld id="cu" label="Currency and amount, if not PKR" k="currency"/>
      <div className="f w"><label htmlFor="d">Project details</label><textarea id="d" rows={4} value={f.details} onChange={e=>set('details',e.target.value)}/><span className="err">{er.details}</span></div>
      <div className="f w btns"><button className="btn" type="submit" disabled={st.t==='loading'}>{st.t==='loading'?'Sending…':'Send project brief'}</button>{CONTACT.whatsapp&&<a className="btn ghost" target="_blank" rel="noopener" href={`https://wa.me/${CONTACT.whatsapp}`}>WhatsApp us</a>}{CONTACT.email&&<a className="btn ghost" href={`mailto:${CONTACT.email}`}>Email us</a>}</div>
      <p role="status" aria-live="polite" className={`w st-${st.t}`}>{st.m}</p></form></section>)
}

function Footer(){
  const [a,setA]=useState(0)
  const links=[CONTACT.email&&{n:CONTACT.email,u:`mailto:${CONTACT.email}`},CONTACT.whatsapp&&{n:'WhatsApp',u:`https://wa.me/${CONTACT.whatsapp}`},...CONTACT.socials.filter(s=>s.url).map(s=>({n:s.name,u:s.url as string}))].filter(Boolean) as {n:string;u:string}[]
  return(<footer className="wrap"><div className="g"><div><b className="logo">VECTOR</b><p className="mut" style={{maxWidth:'32ch',marginTop:12}}>A digital agency for websites, growth, and experiences that keep moving.</p></div>
    <div><b>Navigate</b><ul><li><a href="#services">Services</a></li><li><a href="#work">Work</a></li><li><a href="#process">Process</a></li><li><a href="#contact">Contact</a></li></ul></div>
    <div><b>Services</b><ul>{SERVICES.slice(0,4).map(s=><li key={s}>{s}</li>)}</ul></div>
    <div><b>Contact</b><ul>{links.length?links.map(l=><li key={l.n}><a href={l.u} rel="noopener">{l.n}</a></li>):<li className="mut">Set contact details in .env</li>}</ul></div></div>
    <div className="fm" onPointerMove={e=>setA((e.clientX/innerWidth-.5)*40)} aria-hidden><motion.svg viewBox="0 0 400 60" preserveAspectRatio="none" animate={{skewX:a}} transition={{type:'spring',stiffness:60,damping:15}}>{Array.from({length:40},(_,i)=><line key={i} x1={i*10} y1={60} x2={i*10+20} y2={0} stroke="#f2f2f0" strokeOpacity={.15+(i%4)/10}/>)}</motion.svg></div>
    <p className="mut" style={{fontSize:14,marginTop:24}}>© {new Date().getFullYear()} Vector. All rights reserved.</p></footer>)
}

export default function App(){
  const [ready,setReady]=useState(()=>{try{return !!sessionStorage.getItem('v')}catch{return false}})
  const [cid,setCid]=useState<string|null>(()=>location.hash.startsWith('#case-')?location.hash.slice(6):null)
  const finish=useCallback(()=>{setReady(true);try{sessionStorage.setItem('v','1')}catch{/* ignore */}},[])
  useEffect(()=>{document.body.style.overflow=(!ready||cid)?'hidden':''},[ready,cid])
  const open=useCallback((id:string)=>{history.pushState(null,'','#case-'+id);setCid(id)},[])
  const close=useCallback(()=>{if(location.hash.startsWith('#case-'))history.replaceState(null,'','#work');setCid(null)},[])
  useEffect(()=>{const h=()=>setCid(location.hash.startsWith('#case-')?location.hash.slice(6):null);addEventListener('popstate',h);return()=>removeEventListener('popstate',h)},[])
  const cp=PROJECTS.find(p=>p.id===cid)
  return(<MotionConfig reducedMotion="user">
    <AnimatePresence>{!ready&&<Intro key="i" done={finish}/>}</AnimatePresence>
    <nav><a href="#top" className="logo">VECTOR</a><ul><li><a href="#services">Services</a></li><li><a href="#work">Work</a></li><li><a href="#process">Process</a></li><li><a href="#contact">Contact</a></li></ul></nav>
    <main><Hero ready={ready}/><Experience/><Caps/><Work open={open}/><Process/><Statement/><Contact/></main><Footer/>
    <AnimatePresence>{cp&&<Case key={cp.id} p={cp} close={close}/>}</AnimatePresence></MotionConfig>)
}
